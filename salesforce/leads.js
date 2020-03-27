const nforce = require('nforce')
const org = require('./org')

module.exports = {
  insert: insert,
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
