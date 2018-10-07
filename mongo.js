const mongoose = require('mongoose');
const { mongoConnectionString } = require('./config');

mongoose.connect(mongoConnectionString);

const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));