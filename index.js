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
    response.send('<h1>Welcome to contacts API</h1>');
})

app.get('/info', (request, response) => {
    const date = new Date()

    response.send(`
        <p>Phonebook has info for ${contacts.length} people</p>
        <p>${date}</p>
    `)
})

app.get('/api/persons', (request, response) => {
    response.json(contacts);
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

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})