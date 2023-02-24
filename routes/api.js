const express = require('express')
const router = express.Router()
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore()
const main = db.collection('main')
const history = db.collection('history')
const getCache = require('../helper/cache')


// get the Newest data from main
router.get('/data', async (req, res) => {
  try {
    const datas = await getDataFromMain(1)
    res.json(datas[0])
  } catch (e) { console.log(e) }
})

//get the  history data from main
router.get('/datas', async (req, res) => {
  try {
    let limit = parseInt(req.query.limit)
    limit = limit ? limit : 10
    const datas = await getDataFromMain(limit)
    res.json(datas)
  } catch (e) { console.log(e) }
})

//get history data with type
router.get('/datas/:type', async (req, res) => {
  try {
    const type = req.params.type
    if (type !== 'quarter' && type !== 'hour' && type !== 'day')
      return res.send('Type is invalid')
    const cache = getCache(type)
    const datas = await cache.useCache()
    res.header('Access-Control-Allow-Origin', '*');
    res.json(datas)
  } catch (e) { console.log(e) }
})

module.exports = router

async function getDataFromHistory(type) {
  const amount = {
    quarter: 4,
    hour: 24,
    day: 7
  }
  if (!amount.hasOwnProperty(type))
    return 'Type is invalid'

  const snapshot = await history.where('type', '=', type).limit(amount[type]).orderBy('earliest_timestamp', 'desc').get()
  let datas = []
  snapshot.forEach(doc => {
    const data = doc.data()
    data.humidity_avg = Math.floor(data.humidity_avg, -2)
    data.temperature_avg = Math.floor(data.temperature_avg, -2)
    datas.push(data)
  })
  datas.reverse()
  return datas
}

async function getDataFromMain(number) {
  const snapshot = await main.orderBy('timestamp', 'desc').limit(number).get()
  let datas = []
  snapshot.forEach(doc => {
    datas.push(doc.data())
  })
  return datas
}