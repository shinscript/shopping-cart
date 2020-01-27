const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, './public')));

app.use('*', (err, res) => {
    if(err) res.status(404).send('Route not found');
});

module.exports = app.listen(port, () => console.log(`Listening on PORT: ${port}`));