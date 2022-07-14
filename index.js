require('dotenv').config()
const express = require('express')
const { token } = require('morgan')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.use(morgan(
    'METHOD: :method - URL: :url - STATUS: :status - RESPONSE TIME: :response-time[3] ms - POSTED DATA: :postData'
))

morgan.token('postData', function (req, res, param) {
    return JSON.stringify(req.body)
})


let persons = [
    {
        "name": "Ville",
        "number": "05012345",
        "id": 1,
    },
    {
        "name": "Kalle",
        "number": "04034557",
        "id": 2
    },
    {
        "name": "Anna",
        "number": "05012324",
        "id": 3
    },
    {
        "name": "Hanna",
        "number": "04535123",
        "id": 4
    }
]

const numberOfPersons = persons.length
const timeNow = Date()
const infotext = `<p>Phonebook has info for ${numberOfPersons} people</p> <p>${timeNow}</p>`

app.get('/', (request, response) => {
    response.send('<h1>Hello Phonebook!</h1>')
})

app.get('/info', (request, response) => {
    response.send(infotext)
})


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})


app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)
    response.status(204).end()
})


app.post('/api/persons', (request, response) => {

    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
