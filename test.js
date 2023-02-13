const mqtt = require('mqtt')
const { saveData, saveHistory } = require('./firebaseHandler')

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


const test = async () => {
    const timestamp = new Date();
    let data = {
        'temperature': 24,
        'humidity': 16,
        'timestamp': timestamp.valueOf(),
    }
    quarterHistory.pushData(data)
    const quarterData = await quarterHistory.uoploadData()
    if (quarterData)
        hourHistory.pushData(quarterData)
    const hourData = await hourHistory.uoploadData()
    if (hourData)
        dayHistory.pushData(hourData)
    dayHistory.uoploadData()
}

const onUpdateTime = (type) => {
    let now = new Date(Date.now())
    if (type == Type.QUARTER) {
        return true
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
        uoploadData: async () => {
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

class History {
    constructor(data) {
        this.type = data.type
        this.data = []
        this.isUpdated = false
    }

}