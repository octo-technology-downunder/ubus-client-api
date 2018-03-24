const firebase = require('firebase')
const { getDistanceBetweenGpsPoints } = require('./distance')

// TESTS only
// const { initFirebase } = require('./firebase.service')
// initFirebase()

let clusteringRunning = false

async function runClustering () {

  // Unless one is already running
  if (!clusteringRunning) {

    const mockedPendingTrips = [
      {
        clientUuid: '123',
        start: { lat: -33.869425, long: 151.207334 },
        end: { lat: -33.878368, long: 151.214286 },
      }, {
        clientUuid: '234',
        start: { lat: -33.871955, long: 151.204588 },
        end: { lat: -33.883649, long: 151.214236 },
      }
    ]

    // TESTS Inject mock data
    const pendingRequestsRef = firebase.database().ref('requests/pending')
    await pendingRequestsRef.push(mockedPendingTrips[0])
    console.log('one done')
    await pendingRequestsRef.push(mockedPendingTrips[1])
    console.log('two done')

    // Create fake references for Android app to watch
    await firebase.database().ref(mockedPendingTrips[0].clientUuid).set('')
    console.log('First ref done')
    await firebase.database().ref(mockedPendingTrips[1].clientUuid).set('')
    console.log('Second ref done')

    // --- 1 --- Get all pending requests from Firebase
    // const pendingRequestsRef = firebase.database().ref('requests/pending')
    // const snapshot = await pendingRequestsRef.once("value")
    //
    // const pendingTrips = []
    // snapshot.forEach(function(childSnapshot) {
    //   // console.log('childSnapshot.key', childSnapshot.key)
    //   // console.log('childSnapshot.val()', childSnapshot.val())
    //   pendingTrips.push(childSnapshot.val())
    // })

    // --- 2 --- Mark them as 'being processed'

    // --- 3 --- Look for clusters
    const clusters = findClusters(mockedPendingTrips)
    console.log('clusters', clusters)

    /**
     * Example of answer?
     *
     */

    // --- 4 --- Update Firebase with bus ETA for found groups of people
    if (clusters && clusters.length > 0) {
      let minutes = 0
      clusters.forEach(cluster => {
        cluster.forEach(clientTrip => {
          minutes += 3
          const clientUuidRef = firebase.database().ref(clientTrip.clientUuid)
          clientUuidRef.set(minutes)
        })
      })
    }

    // --- 5 --- Release requests for which no co-traveler has been found

    firebase.database().goOffline()
  }

  /**
   * After 3 failed attempt to cluster one guy, mark the request as "Can't be addressed?
   */
}

/**
 * Ex pendingRequestsPoints:
 * [
 *   {
 *     clientUuid: '123',
 *     start: { lat: -33.871955, long: 151.204588 },
 *     end: { lat: -33.883649, long: 151.214236 },
 *   }, {
 *     clientUuid: '234',
 *     start: { lat: -33.871955, long: 151.204588 },
 *     end: { lat: -33.883649, long: 151.214236 },
 *   }
 * ]
 */
function findClusters (pendingTrips) {
  const clusters = []
  const pendingTripsCopy = JSON.parse(JSON.stringify(pendingTrips))
  // console.log('findClusters, pendingTrips:', pendingTrips)
  pendingTrips.forEach((trip, tripIndex) => {
    pendingTripsCopy
      .filter(otherTrip => otherTrip.clientUuid !== trip.clientUuid)
      .forEach(otherTrip => {
        // console.log('otherTrip', otherTrip)
        const distanceBetweenDepartures = getDistanceBetweenGpsPoints(trip.start, otherTrip.start)
        const distanceBetweenArrivals = getDistanceBetweenGpsPoints(trip.end, otherTrip.end)
        // console.log('distanceBetweenDepartures', distanceBetweenDepartures)
        // console.log('distanceBetweenArrivals', distanceBetweenArrivals)
        if (distanceBetweenDepartures + distanceBetweenArrivals < 2) {
          // We have a cluster
          console.log('We have a cluster of two!')
          clusters.push([trip, otherTrip])
          pendingTripsCopy.splice(tripIndex, 1)
        }
      })
  })
  return clusters
}

// --- TESTS ---
// runClustering()

module.exports = {
  runClustering,
}
