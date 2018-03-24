const express = require('express')
const bodyParser = require('body-parser')
const { initFirebase, storeGpsPoints } = require('./firebase.service')
const { generateUuid } = require('./clientUuid')
const { runClustering } = require('./clustering')

initFirebase()

// --- Express server ---

const app = express()

app.all('/', (req, res) => {
  res.send('Hello, world!')
})

app.all('/trip', bodyParser.json(), async function (req, res) {

  // --- 1 ---
  // Generate client uuid, store it and send it back
  const clientUuid = await generateUuid()
  res.json({
    uuid: clientUuid,
  })

  // --- 2 ---
  // Store GPS start and end points to Firebase
  storeGpsPoints()

  // --- 3 ---
  // Trigger clustering
  runClustering()
})

module.exports = app
