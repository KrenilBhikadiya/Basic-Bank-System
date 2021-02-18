const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/bank_stand2', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message)); 

const seedUsers = [
    {
        name: 'Krenil',
        email: 'krenil80@gmail.com',
        credits: 10000
    },
    {
        name: 'Henil',
        email: 'henil199@gmail.com',
        credits: 11000
    },
    {
        name: 'Prince',
        email: 'prince@gmail.com',
        credits: 15800
    },
    {
        name: 'Krunal',
        email: 'krunal@gmail.com',
        credits: 18000
    },
    {
        name: 'Jaydeep',
        email: 'jd@gmail.com',
        credits: 10500
    },
    {
        name: 'Dishant',
        email: 'dishant@gmail.com',
        credits: 9900
    },
    {
        name: 'Jay',
        email: 'jay09@gmail.com',
        credits: 13000
    },
    {
        name: 'Gopal',
        email: 'gopal32@gmail.com',
        credits: 21900
    },
    {
        name: 'Raj',
        email: 'raj87@gmail.com',
        credits: 53000
	}
]

User.insertMany(seedUsers)
    .then(res => console.log(res))
    .catch(err => console.log(err))
