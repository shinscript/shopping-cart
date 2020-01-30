const display = document.querySelector('.display');
const cart = document.querySelector('.cart');

const clearBtn = document.createElement('button');
clearBtn.className = "clear_btn";
clearBtn.innerHTML = "Clear Cart";
clearBtn.onclick = () => {
  clear();
}

const cart_ctn = document.createElement('div');
cart_ctn.className = "cart_ctn";
cart.appendChild(cart_ctn);

const cart_total_price = document.createElement('p');
cart_total_price.className = "cart_total_price";
cart.appendChild(cart_total_price);

cart.appendChild(clearBtn);

let itemStr = "";

const fetchAndSet = async () => {

  try {
    let res = await fetch('http://localhost:3000/items');
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
      
        let totalPrice;
        if(itemStr.length > 0) {
          fetch('http://localhost:3000/checkout', {
            method: 'POST',
            body: JSON.stringify({ids: itemStr}),
            headers: { 'Content-Type': 'application/json' }
          })
          .then(res => res.json())
          .then(data => {
            totalPrice = data.totalPrice
            cart_total_price.innerHTML = `$${totalPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
          });
        }
        
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

      item_ctn.appendChild(item_showcase);
      item_ctn.appendChild(item_name);
      item_ctn.appendChild(item_price);
      item_ctn.appendChild(addBtn);

      if(res[items].volume_discounts[0]) {
        const item_discount = document.createElement('p');
        item_discount.className = 'item_discount';
        item_discount.innerHTML = `Buy ${res[items].volume_discounts[0].number} for ${(res[items].volume_discounts[0].price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

        item_ctn.appendChild(item_discount);
      }

      display.appendChild(item_ctn);
    }
  } catch (err) {
    if(err) console.error(err);
  }
}

const clear = () => {
  while(cart_ctn.firstChild) {
    cart_ctn.removeChild(cart_ctn.firstChild);
  }
}

fetchAndSet();