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

const infotext =`<p>Phonebook has info for ${numberOfPersons} people</p> <p>${timeNow}</p>`
    


app.get('/', (req, res) => {
    res.send('<h1>Hello Phonebook!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(infotext)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
