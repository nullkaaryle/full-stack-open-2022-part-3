require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


// app uses express library
// express offers an interface for using node features
const app = express()


// mongoose document model, for mongodb
const Person = require('./models/person')


// cors is a middleware to enable Cross-Origin Resource Sharing from different origins
// in this app server is in localhost port 3001 and frontend in localhost port 3000
// by default javascript code in browser would only accept server in same domain
app.use(cors())


// two express built-in middlewares called static and json
// static checks if the "build" directory contains a file corresponding to the GET request's address
// -> for example in frontend there is no address info, so backend handles it
// json takes JSON data of the request and transforms it into a JavaScript object,
// then the object is attached to request body
app.use(express.static('build'))
app.use(express.json())


// morgan is middleware for HTTP request logging for node.js
// console logs method (GET, POST, PUT, DELETE), the url of the request,
// the status code and response time and the possible posted data
app.use(morgan(
  'METHOD: :method - URL: :url - STATUS: :status - RESPONSE TIME: :response-time[3] ms - POSTED DATA: :postData'
))


// token configuration for morgan to show also the data sent in HTTP POST requests
morgan.token('postData', function (request) {
  return JSON.stringify(request.body)
})


// root address (express uses the frontend from build directory for this)
app.get('/', (request, response) => {
  response.send('<h1>Hello Phonebook!</h1>')
})


// info of the number of documents (persons) database and current date and time
// uses mongo function find with empty object
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`<p> Phonebook has info for ${persons.length} people </p> <p>${Date()}</p>`)
  })
})


// find all the persons in database and give them in json list in response
// uses mongo function find with empty object
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


// showing one person from the database as json in the browser
// uses mongoose function findById to find the person with given id
// if no database has no matches for the id, response with status code 404
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


// deleting one person from database
// uses mongoose function findByIdAndRemove
// always responses with status code 204
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


// updating the person with a new phonenumber
// uses mongoose function findByIdAndUpdate
// validates the number for correct format just like when creating new person
// when using findOneAndUpdate mongoose doesn't automatically run validation
// validation is triggered with { runValidators: true, context: 'query' }
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


// creating new person and adding it to the database
// checks if name or number is missing
// saved person is returned in response
app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (!name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }

  if (!number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})


// catches requests made to non-existent routes
// middleware will return an error message in the JSON format
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


// express has built-in error handler
// If you pass an error to next() and you do not handle in a custom error handler,
// it will be handled by the built -in error handler.
// This custom errorHandler below first checks and handles few special cases
// and all the other errors are then passed to the express error for default error handling.
// express custom errorHandlers takes four parameters
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// default error-handling middleware function is added at the end of the middleware function stack
app.use(errorHandler)


// the port is given in the .env file as enviroment variable
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
