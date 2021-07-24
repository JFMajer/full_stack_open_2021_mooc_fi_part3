const { response, request } = require('express')
const express = require('express')
const nodemon = require('nodemon')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
// morgan.token('host', function(req, res) {
//     return req.hostname;
// });
// morgan.token('body', (req, res) => JSON.stringify(req.body));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456",
      "display": true
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "display": true
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "display": true
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423123",
      "display": true
    }
]

app.get('/', (request, response) => {
    response.send('<h1>phonebook</h1>')
})

app.get('/info', (request, response) => {
    let dateNow = new Date();
    let len = persons.length
    response.send(`<p>${dateNow}</p><p>Phonebook has info on ${len} people</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const { id } = request.params
    person = persons.filter(p => p.id == id)
    if (person.length === 0) {
        return response.status(400).json({
            error: 'id not in database'
        })
    }
    response.json(person)
})

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random() * 10000000)
    const { name, number } = request.body
    if (!name) {
        return response.status(400).json({
            error: 'Name is missing'
        })
    }
    if (!number) {
        return response.status(400).json({
            error: 'Number is missing'
        })
    }
    const nameCheck = persons.filter(p => p.name === name)
    if(nameCheck.length !== 0) {
        return response.status(400).json({
            error: 'Name already in phonebook'
        })
    }
    person = {
        "id" : id,
        "name": name,
        "number": number
    }
    persons = persons.concat(person)
    response.json(person)

})

app.delete('/api/persons/:id', (request, response) => {
    const { id } = request.params
    person = persons.filter(p => p.id == id)
    if (person.length === 0) {
        return response.status(400).json({
            error: 'id not in database'
        })
    }
    persons = persons.filter(p => p.id != id)
    response.status(204).end()
})




const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})