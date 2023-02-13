const mqtt = require('mqtt')
const { saveData, saveHistory } = require('./firebaseHandler')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { response } = require('express');

const db = getFirestore()

const option = {
    username: 'user',
    password: '123456'
}

const Type = { // 假的Enum
    QUARTER: "quarter",
    HOUR: "hour",
    DAY: "day",
}

const quarterHistory = createHistory(Type.QUARTER)
const hourHistory = createHistory(Type.HOUR)
const dayHistory = createHistory(Type.DAY)


module.exports = async () => {
    let client = mqtt.connect('ws://192.168.168.169:1884', option)
    client.on('connect', () => {
        console.log(`connected! \n connected time: ${new Date(Date.now())}`)

        client.subscribe('climate/data')
        client.on('message', async (topic, payload) => {
            const timestamp = new Date();
            let data = {
                'temperature': JSON.parse(payload)['temperature'],
                'humidity': JSON.parse(payload)['humidity'],
                'timestamp': timestamp.valueOf(),
            }
            let saveTask = saveData(data)
            saveTask
                .then((response) => {
                    console.log(`save current data successed. now: ${new Date(Date.now())}`)
                })
                .catch((e) => {
                    console.log(e)
                })

            quarterHistory.pushData(data)
            hourHistory.pushData(data)
            dayHistory.pushData(data)

            quarterHistory.updateData()
            hourHistory.updateData()
            dayHistory.updateData()


        })
    })
}

const onUpdateTime = (type) => {
    let now = new Date(Date.now())
    if (type == Type.QUARTER) {
        return now.getMinutes() % 15 == 0
    }
    else if (type == Type.HOUR) {
        return now.getMinutes() == 0
    }
    else if (type == Type.DAY) {
        return now.getHours() == 18
    }
}


function createHistory(type) {
    const history = {
        type: type,
        data: [],
        isUpdated: false
    }

    return {
        pushData: (data) => {
            history.data.push(data)
        },
        getData: () => {
            const data = history.data.concat()
            return data
        },
        updateData: () => {
            if (onUpdateTime(history.type) && !history.isUpdated && history.data.length != 0) {
                saveHistory(history.data, history.type)
                    .then((response) => {
                        history.isUpdated = true
                        history.data.length = 0
                        console.log(`save ${history.type} history successed.`)
                    })
                    .catch((e) => {
                        console.log(e)
                    })
            }
            else if (!onUpdateTime(history.type) && history.isUpdated) {
                history.isUpdated = false
                console.log(`reset ${history.type} history successed.`)
            }
        }
    }
}