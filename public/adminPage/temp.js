let addProductForm = document.getElementById('addProductForm');
let ordersFailTry = document.getElementById('ordersFailMessage');
let usersFailTry = document.getElementById('usersFailMessage');
let productsFailTry = document.getElementById('productsFailMessage');
let loadingSpinners = document.getElementById('loadingSpinners');
let deleteModal = document.getElementById('deleteModal');
let orders, users, products = [];

document.addEventListener('DOMContentLoaded', () => {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});

ordersApp().then((html => {
  document.getElementById('ordersRoot').innerHTML = html;
}))

if (deleteModal) {
  deleteModal.addEventListener('show.bs.modal', event => {
    //getting the product with dats-bs-product
    ordersFailTry.textContent = '';
    const button = event.relatedTarget;
    const id = button.getAttribute('data-bs-to-delete');
    const orderId = deleteModal.querySelector('#orderId');
    orderId.value = id;
  });   
}

addProductForm.addEventListener('submit', async(event) => {
    let name = document.getElementById('name').value;
    let colors = document.getElementById('colors').value;
    let sizes = document.getElementById('sizes').value;
    let price = document.getElementById('price').value;
    let type = document.getElementById('type').value;
    
    loadingSpinners.style.display = 'block';
    event.preventDefault();
    sizes = sizes.split(' ');
    colors = colors.split(' ');
    try{
        await fetch('/admin/createProduct',{
            method:'Post',
            Credential:'include',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            body:`name=${name}&colors=${colors}&sizes=${sizes}&price=${price}&type=${type}`
        })
        .then(response => response.text())
        .then((response) => {
            loadingSpinners.style.display = 'none';
            if (response == 'product created successfully') {
                productsFailTry.style.color = 'green';
                productsFailTry.textContent = response;
            } else {
                productsFailTry.style.color = 'red';
                productsFailTry.textContent = response;
            }
        })
    }catch(err){
        console.error(err);
    }
});

document.getElementById('ordersSearchInput').addEventListener('input', () => {
  const query = document.getElementById('ordersSearchInput').value.trim();
  const root = document.getElementById('ordersRoot');

  ordersFailTry.textContent = '';
  root.innerHTML = '';

  if (!query) {
    Promise.all(orders.map(order => orderPrimeCard(order))).then(ordersCards => {
      root.innerHTML = ordersCards.join('');
  });
      return;
  }

  const filteredOrders = orders.filter(order => {
    const customerNameMatch = order.customerName.trim().toLowerCase().includes(query.trim().toLowerCase());
    const orderIdMatch = order.orderId && order.orderId ? order.orderId.includes(query.trim()) : 'not confirmed'.includes(query.trim());
    
    
    return customerNameMatch || orderIdMatch;
  });
  
  

  if (filteredOrders.length === 0) {
      root.innerHTML = '<h3 class="text-center text-warning">לא נמצאו הזמנות</h3>';
  } else {
      Promise.all(filteredOrders.map(order => orderPrimeCard(order))).then(ordersCards => {
          root.innerHTML = ordersCards.join('');
      });
  }
});


async function ordersApp(){
  
  try {
    const response = await fetch('/admin/getAll?toGet=orders', {
      method: 'GET',
    });
    orders = await response.json();

    if (orders.message === 'order not found') {
      return `<h3 class="text-center">אין הזמנה פעילה</h3>`;
    }

    const ordersCards = await Promise.all(orders.map(order => orderPrimeCard(order)));
    return ordersCards.join('');
  } catch (error) {
    console.error('Error fetching orders', error);
    return '<h3 class="text-center">שגיאה בטעינת ההזמנות</h3>';
  }
}

async function orderPrimeCard(order) {
  const productCards = await Promise.all(order.products.map(async (product) => {
    return await orderCard({
      productName: product.productName,
      price: product.price,
      quantity: product.quantity,
      size: product.size,
      color: product.color,
    });
  }));

  return `
    <div class="card shadow-sm mb-3 col-12" id="order-${order.orderId}">
      <div class="card-body d-flex flex-column justify-content-center" dir="rtl">
        <div class="d-flex flex-wrap align-items-center justify-content-start mb-3">
          <div class="text-right me-3">
            <h4 class="text-primary d-inline ms-2">הזמנה מספר:</h4>
            <span class="text-secondary d-inline" id="orderId" dir="ltr" style="font-weight: bold;">${order.orderId ? order.orderId : 'not confirmed'}</span>
          </div>

          <div class="d-flex flex-wrap align-items-center">
            <div class="text-secondary me-3" id="customerNameDiv">${order.customerName}</div>
            <div class="text-secondary me-3" id="totalPriceDiv">${order.totalPrice} ש"ח</div>
            <div class="me-3" id="isPayedDiv" style="color:${order.isPayed ? 'green' : 'red'}">
              ${order.isPayed ? 'הזמנה שולמה' : 'הזמנה לא שולמה'}
            </div>
            <div class="me-3" id="isReadyDiv" style="color:${order.isReady ? 'green' : 'red'}">
              ${order.isReady ? 'הזמנה מוכנה' : 'הזמנה לא מוכנה'}
            </div>
          </div>
        </div>
        
        <div class="d-flex flex-row justify-content-start">
          <button type="button" class="btn btn-danger me-1 ms-2" data-bs-toggle="modal" data-bs-target="#deleteModal" data-bs-object="order" data-bs-to-delete='${order._id}' data-bs-toggle="tooltip" data-bs-placement="top" title="מחק הזמנה">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>
          </button>
          <button type="button" class="btn btn-secondary me-1 ms-2" id="toggleButton${order._id}" onclick="showDetails('${order._id}')" data-bs-toggle="tooltip" data-bs-placement="top" title="הצג / הסתר פרטים">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down" viewBox="0 0 16 16">
              <path d="M3.204 5h9.592L8 10.481zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659"/>
            </svg>
          </button>
          <button type="button" class="btn btn-warning me-1 ms-2" onclick="markOrderAs('markPayed', '${order._id}')" data-bs-toggle="tooltip" data-bs-placement="top" title="בטל סימון / סמן הזמנה כשולמה">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-dollar" viewBox="0 0 16 16">
              <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z"/>
            </svg>
          </button>
          <button type="button" class="btn btn-success me-1 ms-2" onclick="markOrderAs('markReady', '${order._id}')" ${ !order.isPayed ? 'disabled' : ''} data-bs-toggle="tooltip" data-bs-placement="top" title="בטל סימון / סמן הזמנה כמוכנה">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Products Container -->
      <div id="products-${order._id}" class="products-container" style="display: none;">
        ${productCards.join('')}
      </div>
    </div>`;
}

async function orderCard({ productName, price, quantity, size, color }) {
  return `
    <div class="card shadow-sm mb-3 mx-2">
      <div class="card-body d-flex justify-content-between align-items-center" dir="rtl">
        <div class="text-right">
          <img src=${'../img/'+productName+'.jpg'} alt="${productName} img" class="img-fluid rounded me-3" style="width: 50px; height: auto;">
          <strong class="me-3">${productName}</strong>
        </div>
        <div class="d-flex">
          <span class="ms-3">מחיר: ${price} ש"ח</span>
          <span class="ms-3">מידה: ${size}</span>
          <span class="ms-3">צבע: ${color}</span>
          <span>כמות: ${quantity}</span>
        </div>
      </div>
    </div>`;
}

function showDetails(orderId) {
  const productContainer = document.getElementById(`products-${orderId}`);
  const toggleButton = document.getElementById(`toggleButton${orderId}`);
  toggleButton.innerHTML = '';
  if (productContainer.style.display === 'none') {
    productContainer.style.display = 'block';
    toggleButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up" viewBox="0 0 16 16">
      <path d="M3.204 11h9.592L8 5.519zm-.753-.659 4.796-5.48a1 1 0 0 1 1.506 0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 0 1-.753-1.659"/>
    </svg>`;
  } else {
    productContainer.style.display = 'none';
    toggleButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down" viewBox="0 0 16 16">
      <path d="M3.204 5h9.592L8 10.481zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659"/>
    </svg>`;
  }
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
       
       if (result.message === 'error') {
            ordersFailTry.style.color = 'red';
            ordersFailTry.textContent = 'משהו השתבש, נסה שוב מאוחר יותר';
        } else if (result.message === 'order deleted successfully'){
            ordersFailTry.style.color = 'green';
            ordersFailTry.textContent = 'ההזמנה עודכנה בהצלחה'
            ordersApp().then((html) => {
                document.getElementById('ordersRoot').innerHTML = html;
            });
       } else if (result.message === 'cannot delete payed order'){
            ordersFailTry.style.color = 'red';
            ordersFailTry.textContent = 'לא ניתן למחוק הזמנה לאחר ששולמה'
       }
    } catch (error) {
        ordersFailTry.textContent = 'משהו השתבש, נסה שוב מאוחר יותר';
        console.error(error);
    }
};  

async function markOrderAs(action, id){ 
  try {
     const response = await fetch(`/admin/${action}`, {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
         },
         body: `{"orderId":"${id}"}`,
     });
     const result = await response.json();
     
     if (result.message === 'error') {
        ordersFailTry.style.color = 'red';
        ordersFailTry.textContent = 'משהו השתבש, נסה שוב מאוחר יותר';
      } else if (result.message === 'order updated successfully'){
            ordersFailTry.style.color = 'green';
            ordersFailTry.textContent = 'ההזמנה עודכנה בהצלחה'
          ordersApp().then((html) => {
              document.getElementById('ordersRoot').innerHTML = html;
          });
     } 
  } catch (error) {
        ordersFailTry.textContent = 'משהו השתבש, נסה שוב מאוחר יותר';
        console.error(error);
  }
};  
