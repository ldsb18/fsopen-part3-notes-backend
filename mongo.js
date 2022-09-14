const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log('Please provide the password as an argument: node mongo.js <password>'); 
	process.exit(1);
}

const password = process.argv[2]

const url = `mongodb+srv://Vaskyat:${password}@cluster0.ecqft7p.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

if (process.argv.length === 4) {
	console.log("There's only 1 argument, but 2 are required"); 
	console.log('Please provide the name and number as arguments: node mongo.js <password> <name> <number>');
	process.exit(1);
}

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model('Person', personSchema);


if (process.argv.length > 4) {
	mongoose
		.connect(url)
		.then( response => {
			console.log('connected');

			const person = new Person({
				name: process.argv[3],
				number: process.argv[4],
			});

			person.save();
		})
		.then( () => {
			console.log('new contact saved');

			mongoose.connection.close();
		})
		.catch( err => console.log(err))
}

if (process.argv.length === 3) {
	mongoose
		.connect(url)
		.then( response => {
			Person.find({}).then( person => {

				console.log('Phonebook:');
				
				person.forEach(p => {
					console.log(p.name, p.number);
				})

				mongoose.connection.close();
				console.log('finished');
			})
		})
		.catch( err => console.log(err))
}

