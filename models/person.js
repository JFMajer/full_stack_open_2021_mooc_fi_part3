require('dotenv').config()
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


//database connection
mongoose.connect('mongodb://' + process.env.COSMOSDB_HOST + ':' + process.env.COSMOSDB_PORT + '/' + process.env.COSMOSDB_DBNAME + '?ssl=true&replicaSet=globaldb', {
  retryWrites: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  auth: {
    user: process.env.COSMODDB_USER,
    password: process.env.COSMOSDB_PASSWORD
  }
})
  .then(() => console.log('Connection to CosmosDB successful'))
  .catch((err) => console.error(err))


const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  number: {
    type: String,
    minlength: 8,
    required: true
  },
  display: Boolean
})
personSchema.plugin(uniqueValidator)

//const Person = mongoose.model('Person', personSchema)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)