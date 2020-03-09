const nforce = require('nforce')
const config = require('./config')
const api = require('../api')

// var oauth // don't need this in 'single' user mode

var org = nforce.createConnection({
  environment: 'sandbox',
  mode: 'single',
  username: config.username,
  password: config.password, 
  clientId: config.client_id,
  clientSecret: config.client_secret,
  redirectUri: `${config.connected_app}/oauth/_callback`,
  // oauth: oauth,
})
  
org.authenticate()
.then((auth) => {
  console.log('--> oauth options object:\n' + JSON.stringify(auth) + '\n')
  // oauth = auth
})
.catch((err) => {
  console.log(`--> Org authentication failed: ${err.message}`)
})

module.exports = org