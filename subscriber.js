const mqtt = require('mqtt')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const db = getFirestore()

const option = {
    username: 'user',
    password: '123456'
}

module.exports = async () => {
    let client = mqtt.connect('ws://192.168.168.169:1884', option)
    client.on('connect', () => {
        console.log('connected')
        client.subscribe('climate/data')
        client.on('message', async (topic, payload) => {
            const dateTime = Date.now();
            const timestamp = Math.floor(dateTime / 1000);
            const data = JSON.parse(payload)
            data.timestamp = timestamp
            const res = await db.collection('main').add(data)
            console.log('Added document with ID: ', res.id,data)
        })
    })
}