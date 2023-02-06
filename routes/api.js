const express = require('express')
const router = express.Router()
const mqtt = require('mqtt')

const option = {
    username: 'user',
    password: '123456'
}



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

  module.exports = router
  