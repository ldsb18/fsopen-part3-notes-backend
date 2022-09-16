const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
	.then( result => {
		console.log('connected to MongoDB');
	})
	.catch( err => {
		console.log('error connecting to MongoDb', err.message);
	});

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true,
	},
	number: {
		type: String,
		required: true,
		validate: {
			validator: (v) => {//The 1st regexp test in case the number have 2 parts, the 2nd regexp is for numbers without "-"
				return ( (/^\d{2,3}-\d+$/.test(v) && v.toString().length > 8)  || /^\d{8,}$/.test(v) )
			},
			message: (props) => `${props.value} is not a valid number`
		},
	},
});

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model('Person', personSchema);