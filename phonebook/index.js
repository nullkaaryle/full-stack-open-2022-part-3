const express = require('express')
const app = express()

let persons = [
    {
        "id": 1,
        "name": "Ville",
        "number": "05012345"
    },
    {
        "id": 2,
        "name": "Kalle",
        "number": "04034557"
    },
    {
        "id": 3,
        "name": "Anna",
        "number": "05012324"
    },
    {
        "id": 4,
        "name": "Hanna",
        "number": "04535123"
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
