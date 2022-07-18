// mongoose library offers interface to use mongodb
const mongoose = require('mongoose')


// the address to the mongo database is given in the .env file
const url = process.env.MONGODB_URI


console.log('connecting to', url)

// connecting to mongodb database
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


// this mongoose validator checks that the phonenumber in right format
// accepts Finnish landline numbers such as 09-1234567 and 018-1234567
// accepts Finnish mobile numbers (without land code) such as 040-22334455
// function test returns true if the string given as parameter
// exists in the regex pattern, so it is not checking for exact match
function numberValidator(val) {
  return (/(0([1-9]{1,2})-([0-9]{7}))|(0([0-9]{2})-([0-9]{8}))/).test(val)
}


// with mongoose schema documents that are saved in mongodb
// are all saved in the same style
// mongoose expects name and number in string format
// and mongoose also does some validations
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 15,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    maxlength: 12,
    required: true,
    validate: numberValidator
  }
})


// all documents are returned in JSON
// with mongoose documents or persons are shown like this:
// { "name": "Sanna", "number": "05035723", "id": "62c553c132481dfe4444516d" }
// the _id is object so we create our own id for the person from the _id
// then the _id and the __v are removed because we don't need them
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


// Mongoose models are responsible for creating and reading documents
// from the MongoDB database. An instance of a model is called a document.
// The first argument is the singular name of the collection the model is for.
// Mongoose automatically looks for the plural, lowercased version of the model name.
// In this app, the model "Person" is for the collection that is named "people" in the database.
const Person = mongoose.model('Person', personSchema)


// exports module as a public interface to use
module.exports = Person
