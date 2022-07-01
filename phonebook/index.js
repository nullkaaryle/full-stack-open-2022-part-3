const express = require('express')
const { token } = require('morgan')
const morgan = require('morgan')

const app = express()

app.use(express.json())

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

const persontext = (person) => {
    return (`
        <h3>Contact from the phonebook</h3>
        <p><b>Contact name:</b> ${person.name}</p> 
        <p><b>Contact phonenumber:</b> ${person.number}</p>
        <p><b>Phonebook id:</b> ${person.id}</p>
        `)
}

app.get('/', (request, response) => {
    response.send('<h1>Hello Phonebook!</h1>')
})

app.get('/info', (request, response) => {
    response.send(infotext)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.send(persontext(person))
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)
    response.status(204).end()
})

const generateId = Math.floor(Math.random() * 1000)


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

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId,
    }

    persons = persons.concat(person)

    response.json(person)
})



const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
