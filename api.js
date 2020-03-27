const express = require('express')
const contacts = require('./salesforce/contacts')
const leads = require('./salesforce/leads')

const app = express()
app.use(express.json({ type: 'application/json' })) // this type: is required by body-parser

// define error-handling middleware last, after other app.use() and routes calls
// https://expressjs.com/en/guide/error-handling.html#the-default-error-handler
app.use(function(err, req, res, next) {
  console.log(err.toString())
  if (res.headersSent) return next(err)
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

app.get('/', function (req, res) {
  res.send({"message": "Hello, world"})
})

app.get("/api/contacts", function(req, res) {
  // return SOQL query for the list
})

app.post("/api/contacts", function(req, res) {
  if(JSON.stringify(req.body) == '{}') {
    handleError(res, 400, 'Could not read the request payload.',
                "Make sure the request has a Content-Type header for 'application/json'")
    return
  }
  contacts.insert(req.body, res)
})

app.post("/api/leads", function(req, res) {
  if(JSON.stringify(req.body) == '{}') {
    handleError(res, 400, 'Could not read the request payload.',
                "Make sure the request has a Content-Type header for 'application/json'")
    return
  }
  leads.insert(req.body, res)
})

//Generic error handler for use by all endpoints; Keeps this API from returning HTML error pages
function handleError(res, statusCode, reason, message) {
  console.log("ERROR: " + reason + '\n' + message)
  res.status(statusCode || 500).send(`${reason}\n ${message}`)
}
