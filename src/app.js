const express = require('express')
const {add} = require('./utils')
const app = express()
const uuid = require('uuid/v4')

let GeoFire = require('geofire')

let firebase = require('firebase')
firebase.initializeApp({
  apiKey: 'AIzaSyCrtgzaW7uj82QSbvnLyCIsxIU778MXqJE',
  authDomain: 'ubus-4e991.firebaseapp.com',
  databaseURL: 'https://ubus-4e991.firebaseio.com',
  projectId: 'ubus-4e991',
  storageBucket: 'ubus-4e991.appspot.com',
  messagingSenderId: '715574617670',
})
let firebaseDB = firebase.database()

// geoFireRef.set('some_key', [37.79, -122.41]).then(function () {
//   console.log('Provided key has been added to GeoFire')
// }, function (error) {
//   console.log('Error: ' + error)
// })
//
// geoFireRef.set('{"key":"value"}', [37.79, -122.41]).then(function () {
//   console.log('Provided key has been added to GeoFire')
// }, function (error) {
//   console.log('Error: ' + error)
// })
//
// geoFireRef.set('some_key1', [37.79, -122.41]).then(function () {
//   console.log('Provided key has been added to GeoFire')
// }, function (error) {
//   console.log('Error: ' + error)
// })
//
//
// geoFireRef.get('some_key').then(function (location) {
//   if (location === null) {
//     console.log('some_key is not in GeoFire')
//   } else {
//     console.log('some_key is at location [' + location + ']')
//   }
// })
// firebaseRef.set('{"key1":"{"city":"Sydney"}"}', function () {
//   console.log('Provided key has been added to GeoFire')
// })
//
// firebaseRef.set('{"key1":"{"postcode":"222"}"}', function () {
//   console.log('Provided key has been added to GeoFire')
// })
//
//
// firebaseRef.set('{"key1":"value"}', function () {
//   console.log('Provided key has been added to GeoFire')
// })

app.get('/', function (req, res) {
  const result = add(2, 2)
  res.send(`Hello World, result is ${result}`)
})

function generateUUID () {
  return new Promise(function (resolve, reject) {
    let refId = uuid()
    // store it in firebase
    firebaseDB.ref('trip/' + refId).set('{uuid: ' + refId + '}', function () {
      console.log('Provided key has been added to GeoFire')
      resolve(refId)
    })
  }
  )
}

function calculateETA (id) {
  let value1 = {uuid: id, eta: 10}
  // let value = "{'uuid': '" + id + "', 'eta':10}"
  firebaseDB.ref('trip/' + id).set(JSON.stringify(value1), function () {
    console.log('Provided key has been added to GeoFire')
  })
}

app.post('/trip', function (req, res) {
  generateUUID()
    .then(function (id) {
      res.send(id)
      setTimeout(calculateETA, 10000, id)
    })
})

module.exports = app
