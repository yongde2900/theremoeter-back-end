const mqtt = require('mqtt')
const { saveData, saveHistory } = require('./firebaseHandler')

const option = {
    username: 'user',
    password: '123456',
}

const Type = { // 假的Enum
    QUARTER: "quarter",
    HOUR: "hour",
    DAY: "day",
}

const quarterHistory = createHistory(Type.QUARTER)
const hourHistory = createHistory(Type.HOUR)
const dayHistory = createHistory(Type.DAY)


module.exports = () => {
    let client = mqtt.connect('ws://192.168.168.169:1884', option)
    client.on('connect', () => {
        console.log(`connected! \n connected time: ${new Date(Date.now())}`)
        client.subscribe('climate/data')
        client.on('message', onMessageHandlerasync)
    })
    client.on('offline', () => {
        client.removeListener('message', onMessageHandlerasync)
        console.log('remove onMessageListner')
    })

}




function createHistory(type) {
    const history = {
        type: type,
        data: [],
        isUpdated: false
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

    return {
        pushData: (data) => {
            history.data.push(data)
        },
        getData: () => {
            const data = history.data.concat()
            return data
        },
        uploadData: async () => {
            try {
                if (onUpdateTime(history.type) && !history.isUpdated && history.data.length != 0) {
                    history.isUpdated = true
                    const averageData = await saveHistory(history.data, history.type)
                    history.data.length = 0
                    console.log(`save ${history.type} history successed.`)
                    const data = {
                        temperature: averageData.temperature_avg,
                        humidity: averageData.humidity_avg,
                        timestamp: averageData.earliest_timestamp
                    }
                    return data
                }
                else if (!onUpdateTime(history.type) && history.isUpdated) {
                    history.isUpdated = false
                    console.log(`reset ${history.type} history successed.`)
                    return null
                }
            } catch (e) {
                console.log(e)
            }
        }
    }
}

async function onMessageHandlerasync(topic, payload) {
    try {
        const timestamp = new Date();
        let data = {
            'temperature': JSON.parse(payload)['temperature'],
            'humidity': JSON.parse(payload)['humidity'],
            'timestamp': timestamp.valueOf(),
        }
        await saveData(data)
        console.log(`save current data successed. now: ${new Date(Date.now())}`)


        quarterHistory.pushData(data)
        if (quarterData = await quarterHistory.uploadData()) hourHistory.pushData(quarterData)
        if (hourData = await hourHistory.uploadData()) dayHistory.pushData(hourData)
        dayHistory.uploadData()

    } catch (e) {
        console.log(e)
    }
}