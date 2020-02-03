const express = require('express');
const path = require('path');
const app = express();
const db = require('./db/items');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Server our Static HTML/CSS/JS files from the public folder;
app.use(express.static(path.resolve(__dirname, '../public')));

//API Endpoint to get our items from our JSON database;
app.get('/api/items', (req, res) => {
  res
    .status(200)
    .json(db.find());
});

/* 
  This route allows for any non-existent routes to send an error.
  It's best practice to serve a styled 404 page showing the user that the URL entered
  doesn't exist.
*/
app.use('*', (err, res) => {
  if(err) res.status(404).send('Route not found');
});

module.exports = app;