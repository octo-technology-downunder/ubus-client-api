const firebase = require('firebase')
const { updateBusEtaForClient, archiveRequest } = require('./firebase.service')
const { getDistanceBetweenGpsPoints } = require('./distance')
const { injectMockedData } = require('./mock')

// TESTS only
// const { initFirebase } = require('./firebase.service')
// initFirebase()

let clusteringRunning = false

async function runClustering () {

  // Unless one is already running
  if (!clusteringRunning) {

    // TESTS
    const mockedPendingTrips = injectMockedData()
    console.log('mockedPendingTrips', mockedPendingTrips)

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

    // Example of answer? --> an array of clusters array

    // --- 4 --- For each cluster and for each client, calculate bus ETA

    // --- 5 --- Update Firebase with bus ETA for clusters of people
    if (clusters && clusters.length > 0) {
      let minutes = 0
      clusters.forEach(cluster => {
        cluster.forEach(clientTrip => {
          console.log('clientTrip', clientTrip)
          minutes += 3
          updateBusEtaForClient(clientTrip.clientUuid, minutes)

          // --- 6 --- Archive request
          archiveRequest(clientTrip.key)
        })
      })
    }

    // --- 7 --- Release requests for which no co-traveler has been found

  }

  /**
   * After 3 failed attempt trying to cluster a client, mark the request as "Can't be addressed"?
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
