/**
 * Let's say that all writes to Firebase need to happen here.
 * For reads, it's alright to import 'firebase' in other files
 */

const firebase = require('firebase')

const firebaseConfigNick = {
  apiKey: 'AIzaSyC21n9wUfPdfyE2uMP-p3d4AoIph1O7-FM',
  authDomain: 'ubus-26f5d.firebaseapp.com',
  databaseURL: 'https://ubus-26f5d.firebaseio.com',
  projectId: 'ubus-26f5d',
  storageBucket: 'ubus-26f5d.appspot.com',
  messagingSenderId: '322734367935',
}
const firebaseConfigCni = {
  apiKey: 'AIzaSyCXhZcPsp_IO0lFln7iUEbbaDYJ604F_uU',
  authDomain: 'ubus-775ab.firebaseapp.com',
  databaseURL: 'https://ubus-775ab.firebaseio.com',
  projectId: 'ubus-775ab',
  storageBucket: 'ubus-775ab.appspot.com',
  messagingSenderId: '151863123928',
}

function initFirebase () {
  firebase.initializeApp(firebaseConfigCni)
}

/**
 * Receive a request
 * Display to client: "We have received it."
 * "We'll take one minute to try to put you on a smart bus, or tell you that we can't..."
 * "And FYI, the closest bus is xx minutes away" (Put a bigger number here to not give false hope to customer,
 *   as there is little chance that the bus would go to him right now)
 */

/**
 * Ex gpsPointsPair:
 * {
 *   clientUuid: '123',
 *   start: [-33.871955, 151.204588],
 *   end: [-33.883649, 151.214236],
 * }
 */
function storeGpsPoints(gpsPointsPair) {
  firebase.database().ref('requests/pending').push(gpsPointsPair, err => {
    if (err) {
      console.log('Fail...')
      return
    }
    console.log('Done!')
  })
}

function storeUuid (clientUuid) {
  console.log('clientUuid to store:', clientUuid)
  return firebase.database().ref(clientUuid).set('')
}

async function updateBusEtaForClient (clientUuid, etaBusMinutes) {
  firebase.database().ref(clientUuid).set(etaBusMinutes)
}

async function archiveRequest (clientRequestKey) {
  try {
    const clientRequestRef = firebase.database().ref(`requests/pending/${clientRequestKey}`)
    const newClientRequestRef = firebase.database().ref(`requests/archive/${clientRequestKey}`)
    const clientRequestSnapshot = await clientRequestRef.once('value')
    await newClientRequestRef.set(clientRequestSnapshot.val())
    await clientRequestRef.set(null)
    console.log('Request moved to archive')

    // Later: Also store bus ETA + actual bus arrival time...

  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  initFirebase,
  storeGpsPoints,
  updateBusEtaForClient,
  storeUuid,
  archiveRequest,
}
