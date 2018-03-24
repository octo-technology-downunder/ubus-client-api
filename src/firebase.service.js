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
  console.log('initFirebase()')
  firebase.initializeApp(firebaseConfigCni)
}

// const pendingRequestsRef = firebase.database().ref('requests/pending')

const clientRequest = {
  start: [-33.869425, 151.207334],
  end: [-33.878368, 151.214286],
}

const clientRequest2 = {
  start: [-33.871955, 151.204588],
  end: [-33.883649, 151.214236],
}

// Also inject to Algolia? To enjoy clustering feature in query

// pendingRequestsRef.push(clientRequest, err => {
//   if (err) {
//     console.log('Fail...')
//     return
//   }
//   console.log('Done!')
//   firebase.database().goOffline()
// })

/**
 * Request
 * We have received it.
 * We'll take one minute to try to put you on a smart bus, or tell you that we can't...
 * And FYI, the closest bus is xx minutes away (Put a bigger number here to not give false hope to customer,
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
  pendingRequestsRef.push(gpsPointsPair, err => {
    if (err) {
      console.log('Fail...')
      return
    }
    console.log('Done!')
    // firebase.database().goOffline()
  })
}

function storeUuid (clientUuid) {
  console.log('clientUuid to store:', clientUuid)
  return firebase.database().ref(clientUuid).set('')
}

async function updateBusEta (clientUuid) {
  await firebase.database().ref(clientUuid).set('10')
  console.log('updateBusEta done for', clientUuid)
}

module.exports = {
  firebaseConfig: firebaseConfigCni,
  initFirebase,
  storeGpsPoints,
  updateBusEta,
  storeUuid,
}
