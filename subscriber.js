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

const quarterHistory = {
    type: Type.QUARTER,
    data: [],
    isUpdated: false,
}

const hourHistory = {
    type: Type.HOUR,
    data: [],
    isUpdated: false,
}

const dayHistory = {
    type: Type.DAY,
    data: [],
    isUpdated: false,
}

module.exports = async () => {
    let client = mqtt.connect('ws://192.168.168.169:1884', option)
    client.on('connect', () => {
        console.log(`connected! \n connected time: ${new Date(Date.now())}`)

        client.subscribe('climate/data')
        client.on('message', async (topic, payload) => {
            const timestamp = Math.floor(new Date(Date.now()) / 1000);
            let data = {
                'temperature': JSON.parse(payload)['temperature'],
                'humidity': JSON.parse(payload)['humidity'],
                'timestamp': timestamp,        
            }
            let saveTask = saveData(data)
            saveTask
                .then((response) => {
                    console.log(`save current data successed. now: ${new Date(Date.now())}`)
                })
                .catch((e) => {
                    console.log(e)
                })

            quarterHistory.data.push(data)
            hourHistory.data.push(data)
            dayHistory.data.push(data)

            if (onUpdateTime(quarterHistory.type) && !quarterHistory.isUpdated && quarterHistory.data.length != 0) {
                let saveTask = saveHistory(quarterHistory.data, quarterHistory.type)
                saveTask
                    .then((response) => {
                        quarterHistory.isUpdated = true
                        resetData(quarterHistory)
                        console.log(`save ${quarterHistory.type} history successed.`)
                    })
                    .catch((e) => {
                        console.log(e)
                    })
            }
            else if (!onUpdateTime(quarterHistory.type) && quarterHistory.isUpdated) {
                resetUpdateStatus(quarterHistory)
                console.log(`reset ${quarterHistory.type} history successed.`)
            }

            if (onUpdateTime(hourHistory.type) && !hourHistory.isUpdated && hourHistory.data.length != 0) {
                let saveTask = saveHistory(hourHistory.data, hourHistory.type)
                saveTask
                    .then((response) => {
                        hourHistory.isUpdated = true
                        resetData(hourHistory)
                        console.log(`save ${hourHistory.type} history successed.`)
                    })
                    .catch((e) => {
                        console.log(e)
                    })
            }
            else if (!onUpdateTime(hourHistory.type) && hourHistory.isUpdated) {
                resetUpdateStatus(hourHistory)
                console.log(`reset ${hourHistory.type} history successed.`)
            }

            if (onUpdateTime(dayHistory.type) && !dayHistory.isUpdated && dayHistory.data.length != 0) {
                let saveTask = saveHistory(dayHistory.data, dayHistory.type)
                saveTask
                    .then((response) => {
                        dayHistory.isUpdated = true
                        resetData(dayHistory)
                        console.log(`save ${dayHistory.type} history successed.`)
                    })
                    .catch((e) => {
                        console.log(e)
                    })
            }
            else if (!onUpdateTime(dayHistory.type) && dayHistory.isUpdated) {
                resetUpdateStatus(dayHistory)
                console.log(`reset ${dayHistory.type} history successed.`)
            }

        })
    })
}

const onUpdateTime = (type) => {
    let now = new Date(Date.now())
    if (type == Type.QUARTER) {
        return now.getMinutes() % 46 == 0
    }
    else if (type == Type.HOUR) {
        return now.getMinutes() == 0
    }
    else if (type == Type.DAY) {
        return now.getHours() == 18
    }
}

const resetData = (history) => {
    history.data.length = 0
}

const resetUpdateStatus = (history) => {
    history.isUpdated = false
}