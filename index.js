const express = require('express')
require('dotenv').config()
//const nodemon = require('nodemon')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :host :body'))
morgan.token('host', function (req) {
  return req.hostname
})
morgan.token('body', (req) => JSON.stringify(req.body))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}


app.get('/', (request, response) => {
  response.send('<h1>phonebook</h1>')
})

app.get('/info', (request, response) => {
  let dateNow = new Date()
  response.send(`<p>${dateNow}</p><p>Phonebook has info on TODO people</p>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  Person.findById(id)
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  console.log(request.body)
  const { name, number, display } = request.body
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

  const person = new Person({
    name: name,
    number: number,
    display: display
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  Person.findByIdAndRemove(id)
    .then(result => {
      if (result) {
        response.json(result)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))

})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
