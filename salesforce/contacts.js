const nforce = require('nforce')
const org = require('./org')

module.exports = {
  insert: insert,
  get: get,
}

function get(res) {
  let query = 'SELECT id, name, email, accountid FROM Contact'
  org.query({ query: query }, function(err, resp) {
    console.log(`GET request: ${JSON.stringify(query)}`)
    if(err)
      sendErrorResponse(res, err.statusCode, `--> Error occurred for query:\n ${JSON.stringify(query)}`, err.message)
    else
      res.status(200).json(resp)
  })
}

function insert(newContact, res) {
  if (!(newContact.LastName)) sendErrorResponse(res, 400, 'Invalid user input', 'LastName is required')

  var sObject = nforce.createSObject('Contact', newContact)

  org.insert({ sobject: sObject }, function(err, resp) {
    if(err)
      sendErrorResponse(res, err.statusCode, `--> Unable to insert Contact for ${newContact.FirstName} ${newContact.LastName}`, err.message)
    else {
      console.log(`Contact inserted for ${newContact.FirstName} ${newContact.LastName} ` + JSON.stringify(resp))
      res.status(201).json(resp)
    }
  })
}

function sendErrorResponse( res, status, reason, message) {
  console.log("ERROR: " + reason)
  res.status(status).send(`${reason}\n ${message}`)
}
