let failMessage = document.getElementById('failMessage');

App().then((html) => {
    document.getElementById('root').innerHTML = html;
});

async function App() {
    let order;
    async function fetchOrder() {
      try {
        const response = await fetch('/order/getOrder', {
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
    console.log(order.message);
    
    if (order.message === 'order not found' || !order.isConfirmed || order.products.length == 0 ) {
        return `<h3 class="text-center">אין הזמנה פעילה, אתה יכול להזמין מוצרים בדף הבית</h3>`;
    }

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
        <div class="container my-4">
        <div class="card shadow-sm">
            <div class="card-body d-flex justify-content-between align-items-center" dir="rtl">
                <div class="text-right">
                    <h4 class="text-primary d-inline ms-2"> הזמנה מספר:</h4> 
                    <span class="text-secondary d-inline" id="orderId" dir="ltr" style="font-weight: bold;">${order.orderId}</span>
                </div>
                <div class="d-flex">
                    <button type="button" class="btn btn-danger me-1 ms-2" data-bs-toggle="modal" data-bs-target="#deleteModal" data-bs-order='${order._id}'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
                    </button>
                </div>
            </div>
            ${productCards.join('')}   
            <div class="row"><div class="col-3 mx-auto mb-1 text-secondary" id="totalPriceDiv">סך הכל: ${order.totalPrice} ש"ח</div></div>
            <div class="row"><div class="col-3 mx-auto mb-3" id="isPayedDiv" style="color:${order.isPayed ? 'green' : 'red'}">${order.isPayed ?  'הזמנה שולמה' : 'הזמנה לא שולמה'}</div></div>
        </div>
    </div>
    `;
}

async function Card({productName, price, quantity, size, color}) {

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
            failMessage.textContent = 'לא ניתן למחוק הזמנה לאחר ששילמת עליה'
       }
    } catch (error) {
        failMessage.textContent = 'משהו השתבש, נסה שוב מאוחר יותר';
        console.error(error);
    }
};
