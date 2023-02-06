const express = require('express')
const router = express.Router()
const mqtt = require('mqtt')
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('../trunk-raspberry-pi-tah-firebase-adminsdk-pxjji-d8f129d255.json');

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()



const option = {
  username: 'user',
  password: '123456'
}


// get the real time data from broker
router.get('/data', (req, res) => {
  let client = mqtt.connect('ws://192.168.168.169:1884', option)
  client.on('connect', () => {
    console.log('connected')
    client.subscribe('climate/data')
    client.on('message', (topic, payload) => {
      const data = JSON.parse(payload)
      res.json(data)
      client.end()
    })
  })
})

//get the  history data from database
router.get('/datas', async (req, res) => {

  const main = db.collection('main').orderBy('timestamp')
  const snapshot = await main.get()
  let datas = []
  snapshot.forEach(doc => {
    datas.push(doc.data())
  })
  res.json(datas)
})

module.exports = router
