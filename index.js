const express = require('express')
const app = express();

let persons = [
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

app.use(express.json());

app.get('/', (request, response) => {
    console.log('HTTP 200, home page retrieved');
    response.send('<h1>Welcome to contacts API</h1>');
})

app.get('/info', (request, response) => {
    const date = new Date()

    console.log('HTTP 200, info retrieved');

    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
    `)
})

app.get('/api/persons', (request, response) => {
    console.log('HTTP 200, persons json retrieved');
    response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);

    const person = persons.find( n => n.id === id);

    if(!person){
        console.log('HTTP 404, not found');
        response.status(404).end()
    } else {
        console.log('HTTP 200, success');
        response.json(person)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);

    persons = persons.filter(n => n.id !== id);

    console.log(id, 'HTTP 204, contact deleted');
    response.status(204).end()
})


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})