const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const db = getFirestore()

const dataCollection = db.collection('main')
const historyCollection = db.collection('history')

const saveData = async (data) => {
    const doc = dataCollection.doc()
    return await doc.set(data)
}

const saveHistory = async (dataList, type) => {
    try {
        let doc = historyCollection.doc()
        let temperatures = 0
        let humidities = 0
        let earliestTimestamp = dataList[0].timestamp
        let latestTimestamp = dataList[dataList.length - 1].timestamp
        for (var i = 0; i < dataList.length; i++) {
            temperatures += dataList[i].temperature
            humidities += dataList[i].humidity
        }
        data = {
            'type': type,
            'temperature_avg': temperatures / dataList.length,
            'humidity_avg': humidities / dataList.length,
            'earliest_timestamp': earliestTimestamp,
            'latest_timestamp': latestTimestamp,
        }
        await doc.set(data)
        return data
    } catch (e) {
        console.log(e)
    }
}

module.exports = { saveData, saveHistory }