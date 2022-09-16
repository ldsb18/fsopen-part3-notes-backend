require('dotenv').config()
const express = require('express')
const morgan = require('morgan');

const Person = require('./models/person')

const app = express();
const PORT = process.env.PORT || 3001;


/*let persons = [
	{ 
	  "id": 1,
	  "name": "Arto Hellas", 
	  "number": "040-123456"
	},
	{ 
	  "id": 2,
	  "name": "Ada Lovelace", 
	  "number": "39-44-5323523"
	},
	{ 
	  "id": 3,
	  "name": "Dan Abramov", 
	  "number": "12-43-234345"
	},
	{ 
	  "id": 4,
	  "name": "Mary Poppendieck", 
	  "number": "39-23-6423122"
	}
]

const RANDOM_RANGE = 100000000;
const randomId = () => Math.floor(Math.random() * RANDOM_RANGE) + 4;//+ 4 so randomId func doesn't override id 1-4 */


const requestDataSent = (request, response, next) => {
	request.datasent = request.body;
	next()
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({
		error: 'unknown endpoint'
	})
}

const errorHandler = (error, request, response, next) => {
	
	console.log(error.message);

	if(error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id'})
	} else if (error.name === 'ValidationError') {
		return response.status(400).send({ error: error.message})
	} else if (error.name === 'MatchingNumber') {
		return response.status(400).send({ error: error.message})
	}

	next(error);
}


morgan.token('datasent', (request) => {
	return JSON.stringify(request.datasent);
})

app.use(morgan(':method :url :status :res[content/length] :response-time ms :datasent'))

app.use(express.static('build'))
app.use(express.json());
app.use(requestDataSent)

app.get('/', (request, response) => {
	console.log('LOG: HTTP 200, home page retrieved');
	response.send('<h1>Welcome to contacts API</h1>');
})

app.get('/info', (request, response, next) => {
	const date = new Date()
	console.log('LOG: HTTP 200, info retrieved');

	Person.find({})
		.then(people => {
			response.send(`
				<p>Phonebook has info for ${people.length} people</p>
				<p>${date}</p>
			`)
		})
		.catch( err => next(err))

})

app.get('/api/persons', (request, response, next) => {
	Person.find({})
		.then( people => {
			console.log('LOG: HTTP 200, persons json retrieved');

			response.json(people);
		})
		.catch( err => next(err))
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then( person => {
			if (note) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch( err => next(err))	
})

app.delete('/api/persons/:id', (request, response, next) => {
	
	Person.findByIdAndDelete(request.params.id)
		.then( result => {
			response.status(204).end();
		})
		.catch( err => next(err) )
})

app.post('/api/persons', (request, response, next) => {
	
	const { name, number } = request.body;

	const newPerson = new Person({
		name: name === undefined ? null : name,
		number: number === undefined ? null : number
	})

	Person.find({ number: newPerson.number })
		.then( result => {
			if (result.length === 0) {
				newPerson.save()
					.then( savedPerson => response.json(savedPerson))
					.catch( err => next(err))
			} else {
				const error = new Error('The number is already in phonebook');
				error.name = 'MatchingNumber';
				return next(error);
			}
		})


})

app.put('/api/persons/:id', (request, response, next) => {

	const { name, number } = request.body;

	const person = {
		name: name === undefined ? null : name,
		number: number === undefined ? null : number
	}

	Person.findByIdAndUpdate(
		request.params.id, 
		person, 
		{ new: true, runValidators: true, context: 'query'})
		.then( updatedPerson => {
			response.json(updatedPerson);
		})
		.catch( err => next(err))
})

app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
})