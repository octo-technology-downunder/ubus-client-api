const uuid = require('uuid/v4')
const { storeUuid } = require('./firebase.service')

module.exports.generateUuid = async function () {
  const clientUuid = uuid()
  await storeUuid(clientUuid)
  return clientUuid
}
