let form = document.getElementById('registerForm');
let failTry = document.getElementById('failMessage');
let loadingSpinners = document.getElementById('loadingSpinners');

form.addEventListener('submit', async(event) => {
    let name = document.getElementById('name').value;
    let colors = document.getElementById('colors').value;
    let sizes = document.getElementById('sizes').value;
    let price = document.getElementById('price').value;
    // let img = document.getElementById('img').value;
    
    loadingSpinners.style.display = 'block';
    event.preventDefault();
    sizes = sizes.split(' ');
    colors = colors.split(' ');
    try{
        await fetch('/admin/createProduct',{
            method:'Post',
            Credential:'include',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            body:`name=${name}&colors=${colors}&sizes=${sizes}&price=${price}`
        })
        .then(response => response.text())
        .then((response) => {
            loadingSpinners.style.display = 'none';
            if (response == 'product created successfully') {
                failTry.style.color = 'green';
                failTry.textContent = response;
            } else {
                failTry.style.color = 'red';
                failTry.textContent = response;
            }
        })
    }catch(err){
        console.error(err);
    }
});


App().then((html) => {
    document.getElementById('root').innerHTML = html;
});

async function App() {
    let order;
    async function fetchOrder() {
      try {
        const response = await fetch('/admin/getAllOrders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        order = await response.json();
      } catch (error) {
        console.error('Error fetching order', error);
      }
    }
    
    await fetchOrder();

    if (order.message === 'order not found') {
        return `<h3 class="text-center">אין הזמנה פעיל </h3>`;
    }
    
    const ordersCards = await Promise.all(order.map(async (order) => {
        primeCard(order);
    })); 

    return await ordersCards.join('');
}

async function primeCard(order) {
    
    const productCards = await Promise.all(order.products.map(async (product) => {
        return await Card({
            productName: product.productName,
            price: product.price,
            quantity: product.quantity,
            size: product.size,
            color: product.color,
        });
    })); 

    return `
        <div class="card shadow-sm">
            <div class="card-body d-flex justify-content-between align-items-center" dir="rtl">
                <div class="text-right">
                    <h4 class="text-primary d-inline ms-2"> הזמנה מספר:</h4> 
                    <span class="text-secondary d-inline" id="orderId" dir="ltr" style="font-weight: bold;">${order.orderId}</span>
                </div>
                <div class="text-center">
                    <div class="text-secondary " id="costumerNameDiv">${order.customerName}</div>
                    <div class="" id="isPayedDiv"style="color:${order.isPayed ? 'green' : 'red'}">${order.isPayed ?  'הזמנה שולמה' : 'הזמנה לא שולמה'}</div>
                </div>
                <div class="d-flex">
                    <button type="button" class="btn btn-danger me-1 ms-2" data-bs-toggle="modal" data-bs-target="#deleteModal" data-bs-order='${order.orderId}'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-secondary me-1 ms-2" onclick="showDetails('${order.orderId}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down" viewBox="0 0 16 16">
                            <path d="M3.204 5h9.592L8 10.481zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659"/>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-success me-1 ms-2" onclick="markReady('${order.orderId}')" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                        </svg>
                    </button>
                </div>
            </div>
            ${productCards.join('')}   
        </div>`
}

async function Card({productName, price, quantity, size, color}) {

    return `
        <div class="card shadow-sm mb-3 mx-2">
            <div class="d-flex">
                <span class="ms-3">מחיר: ${price} ש"ח</span>
                <span class="ms-3">מידה: ${size}</span>
                <span class="ms-3">צבע: ${color}</span>
                <span>כמות: ${quantity}</span>
            </div>  
         </div> 
    `;
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
        } else if (result.message === 'order deleted successfully'){
            failMessage.style.color = 'green';
            failMessage.textContent = 'ההזמנה עודכנה בהצלחה'
            App().then((html) => {
                document.getElementById('root').innerHTML = html;
            });
       } else if (result.message === 'cannot delete payed order'){
            failMessage.style.color = 'red';
            failMessage.textContent = 'לא ניתן למחוק הזמנה לאחר ששולמה'
       }
    } catch (error) {
        failMessage.textContent = 'משהו השתבש, נסה שוב מאוחר יותר';
        console.error(error);
    }
};
