const fs = require('fs');
const { isEmpty } = require('./helper');

let readLocation;
let itemList;
const cache = {};

if (process.env.NODE_ENV === 'test') readLocation = `${__dirname}/items.test.json`;
else readLocation = `${__dirname}/items.dev.json`;

if(!isEmpty(cache)) itemList = cache;
else itemList = JSON.parse(fs.readFileSync(readLocation));

const db = {};

db.calculate = (str) => {
  let itemCountCache = {};
  let totalPrice = 0;
  
  for(let i = 0; i < str.length; i += 1) {
    let item = str[i];
    if(!itemCountCache[item]) itemCountCache[item] = 1;
    else itemCountCache[item] += 1;
  }

  for(let item in itemCountCache) {
      while(itemCountCache[item] > 0) {
        if(cache[item].volume_discounts.length && itemCountCache[item] >= cache[item].volume_discounts[0].number) {
          itemCountCache[item] -= cache[item].volume_discounts[0].number;
          totalPrice += cache[item].volume_discounts[0].price;
        } else {
          itemCountCache[item] -= 1;
          totalPrice += cache[item].unit_price;
        }
      }
  }
  return totalPrice;
}

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