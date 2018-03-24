const express = require('express')
const bodyParser = require('body-parser')
const { initFirebase, storeGpsPoints, updateBusEta } = require('./firebase.service')
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
  // Generate and send back uuid
  const clientUuid = await generateUuid()
  res.json({
    uuid: clientUuid,
  })

  // For TESTS
  setTimeout(() => {
    updateBusEta(clientUuid)
  }, 10000)

  // --- 2 ---
  // Store GPS start and end points to Firebase
  // storeGpsPoints()

  // --- 3 ---
  // Trigger clustering
  // runClustering()
})

module.exports = app
