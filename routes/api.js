const express = require('express')
const router = express.Router()
const mqtt = require('mqtt')
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore()

const option = {
  username: 'user',
  password: '123456'
}

// get the real time data from broker
router.get('/data', async(req, res) => {
  const main = db.collection('main').orderBy('timestamp','desc').limit(1)
  const snapshot = await main.get()
  let datas = []
  snapshot.forEach(doc => {
    datas.push(doc.data())
  })
  res.json(datas[0])
})

//get the  history data from database
router.get('/datas', async (req, res) => {
  let limit = parseInt(req.query.limit)
  limit = limit ? limit : 10
  const main = db.collection('main').orderBy('timestamp','desc').limit(limit)
  const snapshot = await main.get()
  let datas = []
  snapshot.forEach(doc => {
    datas.push(doc.data())
  })
  res.json(datas)
})

module.exports = router
