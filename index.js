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

morgan.token('datasent', (request) => {
    return JSON.stringify(request.datasent);
})

app.use(morgan(':method :url :status :res[content/length] :response-time ms :datasent'))

app.use(express.json());
app.use(express.static('build'))
app.use(requestDataSent)

/*app.get('/', (request, response) => {
    console.log('LOG: HTTP 200, home page retrieved');
    response.send('<h1>Welcome to contacts API</h1>');
})*/

app.get('/info', (request, response) => {
    const date = new Date()
    console.log('LOG: HTTP 200, info retrieved');

    Person.find({}).then(people => {
        response.send(`
            <p>Phonebook has info for ${people.length} people</p>
            <p>${date}</p>
        `)
    })

})//al toque mi rey

app.get('/api/persons', (request, response) => {
    Person.find({}).then( people => {
        console.log('LOG: HTTP 200, persons json retrieved');

        response.json(people);
    })
})

app.get('/api/persons/:id', (request, response) => {
    const _id = Number(request.params.id);

    Person.find({}).then(people => {

        //console.log(JSON.stringify(people, null, '\t'));

        if(!people[_id]){
            console.log('LOG: HTTP 404, not found');
            response.status(404).end()
        } else {
            console.log('LOG: HTTP 200, success');
            response.json(people[_id])
        }
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);

    persons = persons.filter(n => n.id !== id);

    console.log(id, 'LOG: HTTP 204, contact deleted');
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!(body.number && body.name)) {


        console.log('LOG: HTTP 400, missing information');
        return response.status(400).json({
            error: 'Name or number are missing'
        })
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number,
    })

    console.log('LOG: HTTP 200, success');
    newPerson.save().then( savedPerson => response.json(savedPerson));
})

app.use(unknownEndpoint)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})