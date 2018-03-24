const firebase = require('firebase')

module.exports.injectMockedData = function () {

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
  const tripOne = pendingRequestsRef.push(mockedPendingTrips[0])
  mockedPendingTrips[0].key = tripOne.key
  const tripTwo = pendingRequestsRef.push(mockedPendingTrips[1])
  mockedPendingTrips[1].key = tripTwo.key

  // Create fake references for Android app to watch
  firebase.database().ref(mockedPendingTrips[0].clientUuid).set('')
  firebase.database().ref(mockedPendingTrips[1].clientUuid).set('')

  console.log('Mock data injected, 2 points + corresponding client references')

  return mockedPendingTrips
}
