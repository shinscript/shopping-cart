const express = require('express');
const path = require('path');
const app = express();
const db = require('./db/items');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/items', (req, res) => {
  res
    .status(200)
    .json(db.find());
});

app.post('/checkout', (req, res) => {
  const { ids } = req.body;
  console.log(ids);
  db.find();
  let totalPrice = db.calculate(ids);
  res
    .status(200)
    .json({ totalPrice: totalPrice });
    
})

app.use('*', (err, res) => {
  if(err) res.status(404).send('Route not found');
});

module.exports = app;