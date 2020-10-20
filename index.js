const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose
  .connect(
    'mongodb://mongo:27017/docker-node-mongo',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const Item = require('./models/Item');

app.get('/', (req, res) => {
  Item.find()
    .then(items => res.render('index', { items }))
    .catch(err => res.status(404).json({ msg: 'No items found' }));
});

app.post('/item/add', (req, res) => {
  kgSearchAPI(req.body.name)
    .then((respond) => { 
	    const newItem = new Item({ name: req.body.name, imageUrl: respond.data})
	    newItem.save().then(item => res.redirect('/'));
    }) 
});

function kgSearchAPI(text){
  return axios.post('https://us-central1-hidden-slice-291907.cloudfunctions.net/kgSearch',{text:text})
}
const port = 3000;

app.listen(port, () => console.log('Server running...'));
