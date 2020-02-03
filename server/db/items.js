const fs = require('fs');
// ES6 destructuring to grab our isEmpty function; 
const { isEmpty } = require('./helper');

/*
  Overall idea of this middleware/file is to listen for a test or dev command.
  If we are testing our code the readLocation becomes initialized to a test JSON database;
  If we are in Production or in this case "dev" we get our data from the dev JSON Database ("real database");

  Once we get our data we set it to our itemList variable. 
    - if a request comes in it parses the itemList object and caches our information into our "cache" variable
      -> this allows for any further requests to read off the server-side cache rather than doing a "fetch" for
         the information in our database everytime.
*/
let readLocation; 
let itemList;
const cache = {};

if (process.env.NODE_ENV === 'test') readLocation = `${__dirname}/items.test.json`;
else readLocation = `${__dirname}/items.dev.json`;

if(!isEmpty(cache)) itemList = cache;
else itemList = JSON.parse(fs.readFileSync(readLocation));

const db = {};

//.find() middleware that caches our request;
db.find = () => {
  if(isEmpty(cache)) {
    itemList.forEach(el => {
        cache[el.id] = {
          description: el.description,
          unit_price: el.unit_price,
          volume_discounts: el.volume_discounts
        }
    });
  }

  return cache;
}

module.exports = db;