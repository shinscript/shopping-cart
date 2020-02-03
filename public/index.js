const display = document.querySelector('.display');
const cart = document.querySelector('.cart');


/*
  Allows for shopping cart button to show and close cart;
*/
const cartBtn = document.querySelector('.cart-btn');

let hasBeenClicked = false;
cart.style.display = 'none';
cartBtn.onclick = () => {
  if(!hasBeenClicked) {
    cart.style.display = 'grid';
    hasBeenClicked = true;
  } else {
    cart.style.display = 'none';
    hasBeenClicked = false;
  }
}

/*
  Allows for user to clear and reset items in a cart;
*/
const clearBtn = document.createElement('button');
clearBtn.className = "clear_btn";
clearBtn.innerHTML = "Clear Cart";
clearBtn.onclick = () => {
  clear();
  cart_total_price.innerHTML = "";
  totalPrice = 0;
  itemStr = "";
}

const cart_ctn = document.createElement('div');
cart_ctn.className = "cart_ctn";
cart.appendChild(cart_ctn);

const cart_total_price = document.createElement('p');
cart_total_price.className = "cart_total_price";
cart.appendChild(cart_total_price);

cart.appendChild(clearBtn);

let itemStr = ""; //Initial String value to contain the Id's for each item when added into cart.
let totalPrice = 0; //Initial Total price value;


/*
  In the fetchAndSet function we are calling an async function that does a fetch request to our API,
  gets the information from the response and creates a DIV || item container for each item we get.

  It creates all the parent & child nodes + the add_to_cart button for each item.

*/
const fetchAndSet = async () => {

  try {
    let res = await fetch('http://localhost:3000/api/items');
    res = await res.json();
    for(let items in res) {
      const item_ctn = document.createElement('div');
      item_ctn.className = "item_ctn";

      const item_showcase = document.createElement('p');
      item_showcase.className = "item_showcase";
      item_showcase.innerHTML = items;

      const item_name = document.createElement('p');
      item_name.className = "item_name";
      item_name.innerHTML = res[items].description;

      const item_price = document.createElement('p');
      item_price.className = "item_price";
      item_price.innerHTML = `$${(res[items].unit_price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

      const addBtn = document.createElement('button');
      addBtn.className = "add_btn";
      addBtn.innerHTML = "Add To Cart";
      addBtn.onclick = () => {
        itemStr += items;
        console.log(itemStr)
        
        //Here we run the calculate function to get a new total price every time we add an item into our cart.
        if(itemStr.length > 0) {
          totalPrice = calculate(itemStr, res);
          cart_total_price.innerHTML = `Total Price : $${totalPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
        }
        
        // Then we create a parent & child node inside of the cart for each item added.
        const cart_item_ctn = document.createElement('div');
        cart_item_ctn.className = "cart_item_ctn"
        
        const cart_item_name = document.createElement('p');
        cart_item_name.className = "item_name";
        cart_item_name.innerHTML = res[items].description;

        const cart_item_price = document.createElement('p');
        cart_item_price.className = "item_price";
        cart_item_price.innerHTML = `$${(res[items].unit_price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

        cart_item_ctn.appendChild(cart_item_name);
        cart_item_ctn.appendChild(cart_item_price);

        cart_ctn.appendChild(cart_item_ctn);
      }

      const item_discount = document.createElement('p');
      item_discount.className = 'item_discount'

      //Here we display the discounts IF they are available. If an item has no discount then we just display "no discount".
      if(res[items].volume_discounts[0]) {
        item_discount.innerHTML = `Buy ${res[items].volume_discounts[0].number} for ${(res[items].volume_discounts[0].price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
      } else item_discount.innerHTML = 'No Discount';

      
      item_ctn.appendChild(item_discount)

      item_ctn.appendChild(item_showcase);
      item_ctn.appendChild(item_name);
      item_ctn.appendChild(item_price);
      item_ctn.appendChild(addBtn);

      display.appendChild(item_ctn);
    }

  /*
    If the server sends a server error we console.error the error. 
    Best practice is to display some 404 page and/or show the user something went wrong on the server's end.
  */
  } catch (err) { 
    if(err) console.error(err);
  }
}

//Clear Btn functionailty;
const clear = () => {
  while(cart_ctn.firstChild) {
    cart_ctn.removeChild(cart_ctn.firstChild);
  }
}

//Calculate Total Price functionality;
const calculate = (str, cache) => {
  let itemCountCache = {};
  let price = 0;
  for(let i = 0; i < str.length; i += 1) {
    let item = str[i];
    if(!itemCountCache[item]) itemCountCache[item] = 1;
    else itemCountCache[item] += 1;
  }

  for(let item in itemCountCache) {
      while(itemCountCache[item] > 0) {
        if(cache[item].volume_discounts.length && itemCountCache[item] >= cache[item].volume_discounts[0].number) {
          itemCountCache[item] -= cache[item].volume_discounts[0].number;
          price += cache[item].volume_discounts[0].price;
        } else {
          itemCountCache[item] -= 1;
          price += cache[item].unit_price;
        }
      }
  }

  console.log(price);
  return price;
}

fetchAndSet();