const express = require('express')
const contacts = require('./salesforce/contacts')
const leads = require('./salesforce/leads')

const app = express()
app.use(express.json({ type: 'application/json' })) // this type: is required by body-parser

app.use(function(req, res, next){
  if (req.method == 'POST'){
    if(JSON.stringify(req.body) == '{}') {
      handleError(res, 400, 'Could not read the request payload.',
        "Make sure the request has a Content-Type header ('application/json')")
      return
    }
  }
  next()
})

// define error-handling middleware last, after other app.use() calls
// https://expressjs.com/en/guide/error-handling.html#the-default-error-handler
app.use(function(err, req, res, next) {
  if (res.headersSent) return next(err)
  console.log(err.toString())
  handleError(res, 500, 'Unhandled error', err.toString())
})

const port = process.env.PORT || 3000

app.listen(port, '0.0.0.0', function() {
  console.log(`Listening on Port ${port}`)
})

app.options(function(req, res) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Accept, Authorization, Content-Type, Origin, X-Requested-With',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, PATCH, DELETE, OPTIONS',
  })
  res.send(204)
})

app.route('/')
  .get(function (req, res) {
    res.send({"message": "Hello, world"})
  })

app.route('/api/contacts')
  .get(function(req, res) {
    return contacts.get(res)
  })
  .post(function(req, res) {
    contacts.insert(req.body, res)
  })

app.route('/api/leads')
  .get(function(req, res) {
    return leads.get(res)
  })
  .post(function(req, res) {
    leads.insert(req.body, res)
  })

//Generic error handler for use by all endpoints; Keeps this API from returning HTML error pages
function handleError(res, statusCode, reason, message) {
  console.log("ERROR: " + reason + '\n' + message)
  res.status(statusCode || 500).send(`${reason}\n ${message}\n`)
}
