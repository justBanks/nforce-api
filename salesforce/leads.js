const nforce = require('nforce')
const org = require('./org')

module.exports = {
  insert: insert,
  get: get,
}

function get(res) {
  let query = 'SELECT id, name, email, company, status, convertedcontactid FROM Lead'
  org.query({ query: query }, function(err, resp) {
    console.log(`GET request: ${JSON.stringify(query)}`)
    if(err)
      sendErrorResponse(res, err.statusCode, `--> Error occurred for query:\n ${JSON.stringify(query)}`, err.message)
    else
      res.status(200).json(resp)
  })
}

function insert(newLead, res) {
  if (!(newLead.LastName)) sendErrorResponse(res, 400, 'Invalid user input', 'LastName is required')
  if (!(newLead.Company)) newLead.Company = `${newLead.LastName} Household`
  
  var sObject = nforce.createSObject('Lead', newLead)

  org.insert({ sobject: sObject }, function(err, resp) {
    if(err)
      sendErrorResponse(res, err.statusCode, `--> Unable to insert Lead for ${newLead.Email}`, err.message)
    else {
      console.log(`Lead inserted for ${newLead.Email} ` + JSON.stringify(resp))
      res.status(201).json(resp)
    }
  })
}

function sendErrorResponse( res, status, reason, message) {
  console.log("ERROR: " + reason)
  res.status(status).send(`${reason}\n ${message}`)
}
