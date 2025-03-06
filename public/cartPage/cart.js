let totalPriceDiv = document.getElementById('totalPriceDiv');
let failMessage = document.getElementById('failMessage');
let confirmOrderButton = document.getElementById('confirmOrderButton');
let removeOrderButton = document.getElementById('removeOrderButton');
let confirmationMessage = document.getElementById('confirmationMessage');

App().then((html) => {
    document.getElementById('root').innerHTML = html;
});

confirmOrderButton.addEventListener('click', async () => {
    try {
        const response = await fetch('cart/confirmOrder', {method: 'POST',})
        result = await response.json();
        if (result.message === 'order confirmed') {
            confirmOrderButton.style.display = 'none';
            confirmationMessage.style.display = 'block';
            confirmationMessage.textContent = 'ניתן לצפות בהזמנה בדף המעקב ,' + 'הזמנה אושרה' ;
            App().then((html) => {
                document.getElementById('root').innerHTML = html;
            });
        } else {
            failMessage.style.color = 'red';
            failMessage.textContent = 'משהו השתבש, נסה שוב מאוחר יותר';
        }
    } catch (error) {
        console.error(error);
    }
});

removeOrderButton.addEventListener('click', async () => {
    try {
        const response = await fetch('cart/removeOrder', {method: 'DELETE',})
        result = await response.json();
        if (result.message === 'order removed') {
            confirmationMessage.style.display = 'none';
            confirmationMessage.textContent = '';
            failMessage.style.color = 'green';
            failMessage.textContent = 'ההזמנה הוסרה בהצלחה';
        } else {
            failMessage.style.color = 'red';
            failMessage.textContent = 'משהו השתבש, נסה שוב מאוחר יותר';
        }
        App().then((html) => {
            document.getElementById('root').innerHTML = html;
        });
    } catch (error) {
        console.error(error);
    }
})

function validatePositivity(event){
    quantity = event.target;
    quantity.value > 0 ? quantity.setCustomValidity('') : quantity.setCustomValidity('אי אפשר להכניס ערכים שלילים בכמות');
}

async function App() {
    let counter = -1;
    let order;
    async function fetchOrder() {
        try {
            await fetch('/cart/getUserOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(async(res) => order = await res.json());
        } catch (error) {
            console.error('Error fetching order', error);
        }
    }
    await fetchOrder();
    console.log(order);
    if (order.message === 'user not logged in') {
        try {
            order = {products: JSON.parse(localStorage.getItem('cart')) || [], totalPrice: JSON.parse(localStorage.getItem('totalPrice')) || 0};
        } catch (error) {
            console.error(error);
        }
    } else {

        if (order.message === 'order not found' || order.products.length == 0 || order.isConfirmed) {
            confirmOrderButton.style.display = 'none';
            removeOrderButton.style.display = 'none';
            totalPriceDiv.style.display = 'none';
            return `<h3 class="text-center"> אין הזמנה פעילה, אתה יכול להזמין מוצרים בדף הבית, או לבדוק הזמנה קיימת במעקב הזמנות</h3>`;
        }
        removeOrderButton.style.display = 'block';
        totalPriceDiv.style.display = 'block';
        totalPriceDiv.textContent = `סך הכל: ${order.totalPrice} ש"ח`;
        if (order.isConfirmed){
            confirmOrderButton.style.display = 'none';
            confirmationMessage.textContent = 'ההזמנה אושרה, מספר ההזמנה שלך הוא:' + order.orderId;
            confirmationMessage.style.display = 'block';
        }else{
            confirmOrderButton.style.display = 'block';
            confirmationMessage.style.display = 'none';
        }   
    }

    if (isLogged()) {
        confirmOrderButton.removeAttribute('disabled');
        confirmOrderButton.removeAttribute('data-bs-toggle');
        confirmOrderButton.removeAttribute('data-bs-placment');
        confirmOrderButton.removeAttribute('title');
    }

    const productCards = await Promise.all(order.products.map(async (product) => {
        counter++;
        return await Card({
            productName: product.productName,
            price: product.price,
            quantity: product.quantity,
            color: product.color,
            size: product.size,
            counter: counter,
        });
    }));    
    return `<div class="row g-3">${productCards.join('')}</div>`;
}
  


async function selectUpdate(product, toUpdate, selected) {
    try {
        let response = await fetch('/getProductDetails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `productName=${product}`,
        });
        response = await response.json();

        let options = [];
        if (toUpdate === 'color') {
            options = response.colors.map(element => createOption(element, selected));
        } else if (toUpdate === 'size') {
            options = response.sizes.map(element => createOption(element, selected));
        } else if (toUpdate === 'img') {
            return response.img;
        }

        return options.join('');
    } catch (error) {
        console.error('Error in selectUpdate:', error);
        return ''; 
    }
}


function createOption(element, selected) {
    return `<option value="${element}" ${element === selected ? 'selected' : ''}>${element}</option>`;
}

async function onSubmit(event){
    event.preventDefault(); 
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
       const response = await fetch(form.action, {
           method: form.method,
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify(data),
       });
       const result = await response.json();
       console.log(result.message);
       
       if (result.message === 'error') {
        failMessage.style.color = 'red';
        failMessage.textContent = 'משהו השתבש, נסה שוב מאוחר יותר';
    } 
    else if (result.message === 'order updated'){
        failMessage.style.color = 'green';
        failMessage.textContent = 'ההזמנה עודכנה בהצלחה'
        App().then((html) => {
            document.getElementById('root').innerHTML = html;
        });
       }
    } catch (error) {
        failMessage.textContent = 'משהו השתבש, נסה שוב מאוחר יותר';
        console.error(error);
    }
};

async function deleteProduct(index) {
    try {
        const response = await fetch('/cart/removeProduct', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
          body: `index=${index}`,
        });
        result = await response.json();
        if (result.message === 'user not logged in') {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (index < 0 || index >= cart.length) {
                failMessage.style.color = 'red';
                failMessage.textContent = 'משהו השתבש, נסה שוב מאוחר יותר';
            }
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('totalPrice', cart.map(product => product.price * product.quantity));
        } else if (result.message === 'order updated') {
            failMessage.style.color = 'green';
            failMessage.textContent = 'ההזמנה עודכנה בהצלחה'
        } 
        else {
            failMessage.style.color = 'red';
            failMessage.textContent = 'משהו השתבש, נסה שוב מאוחר יותר';
        }
        App().then((html) => {
            document.getElementById('root').innerHTML = html;
        });
    }catch(error) {
        console.error('Error fetching order', error);
    }
}

async function isLogged() {
    try {
      const response = await fetch('/checkAuth', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const text = await response.text();
      return text === 'user logged' ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
}

async function Card({ productName, price, quantity, color, size, counter }) {
    const imgSrc = await selectUpdate(productName, 'img');
    const colorOptions = await selectUpdate(productName, 'color', color);
    const sizeOptions = await selectUpdate(productName, 'size', size);

    return `
      <div class="col-lg-6 mb-3" dir="rtl">
        <div class="card h-100">
            <form action="/cart/updateOrder" method="POST" onsubmit="onSubmit(event)">
                <input type="hidden" name="index" value="${counter}">
                <div class="card-body d-flex align-items-start">
                    <div class="d-flex flex-column ms-3">
                        <img src="${imgSrc}" alt="${productName} img" class="img-fluid rounded" style="width: 100px;" />
                        <div id="productName${counter}" class="mb-2">
                            <strong>${productName}</strong>
                        </div>
                        <div id="price${counter}" class="mb-2">
                            מחיר: ${price} ש"ח
                        </div>
                    </div>
                    <div class="d-flex flex-column flex-grow-1 ms-3">
                        <div id="quantityDiv${counter}" class="mb-2">
                            <label for="quantity${counter}">כמות</label>
                            <input type="number" class="form-control" name="quantity" id="quantity${counter}" value="${quantity}" onchange='validatePositivity(event)' required>
                        </div>
                        <div id="colorDiv${counter}" class="mb-2">
                            <label for="colorSelect${counter}">צבע</label>
                            <select class="form-select" aria-label="select color" id="colorSelect${counter}" name="color">${colorOptions}</select>
                        </div>
                        <div id="sizeDiv${counter}" class="mb-2">
                            <label for="sizeSelect${counter}">מידה</label>
                            <select class="form-select" aria-label="select size" id="sizeSelect${counter}" name="size">${sizeOptions}</select>
                        </div>
                    </div>
                    <div class="d-flex flex-column justify-content-between mx-auto h-100">
                        <input type="submit" class="btn btn-outline-primary mb-3" value="שנה פרטי הזמנה"/>
                        <button type="reset" class="btn btn-outline-secondary mb-3">איפוס</button>
                        <button type="button" class="btn btn-outline-danger mb-3" onclick="deleteProduct(${counter})">הסרת מוצר מהעגלה</button>
                    </div>
                </div>
            </form>
        </div>
    </div>`;
}