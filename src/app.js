const express = require('express')
const {add} = require('./utils')
const app = express()

let GeoFire = require('geofire')

let firebase = require('firebase')
firebase.initializeApp({
  apiKey: 'AIzaSyC21n9wUfPdfyE2uMP-p3d4AoIph1O7-FM',
  authDomain: 'ubus-26f5d.firebaseapp.com',
  databaseURL: 'https://ubus-26f5d.firebaseio.com',
  projectId: 'ubus-26f5d',
  storageBucket: 'ubus-26f5d.appspot.com',
  messagingSenderId: '322734367935'
})
let firebaseRef = firebase.database().ref()
// Create a GeoFire index
let geoFireRef = new GeoFire(firebaseRef)

geoFireRef.set('some_key', [37.79, -122.41]).then(function () {
  console.log('Provided key has been added to GeoFire')
}, function (error) {
  console.log('Error: ' + error)
})

geoFireRef.set('some_key', [37.79, -122.41]).then(function () {
  console.log('Provided key has been added to GeoFire')
}, function (error) {
  console.log('Error: ' + error)
})

geoFireRef.set('some_key1', [37.79, -122.41]).then(function () {
  console.log('Provided key has been added to GeoFire')
}, function (error) {
  console.log('Error: ' + error)
})
geoFireRef.get('some_key').then(function (location) {
  if (location === null) {
    console.log('some_key is not in GeoFire')
  } else {
    console.log('some_key is at location [' + location + ']')
  }
})
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

module.exports = app
