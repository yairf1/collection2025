const addToCartModal = document.getElementById('addToCartModal');
const failMessage = document.getElementById('failMessage');
const addToCartForm = document.getElementById('addToCartForm');
const quantity = document.getElementById('quantity');

if (addToCartModal) {
  addToCartModal.addEventListener('show.bs.modal', event => {
    failMessage.textContent = '';
    const button = event.relatedTarget;
    const productName = button.getAttribute('data-bs-product');
    const price = button.getAttribute('data-bs-price');
    addToCartModal.removeAttribute('aria-hidden');
    updateModal(productName, price);
  });  
  addToCartModal.addEventListener('hide.bs.modal', event => {
    addToCartModal.setAttribute('aria-hidden', 'true');
  });  
}  

addToCartForm.addEventListener('submit', async (event) => {
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
     
    if (result.message === 'something went wrong') {
      failMessage.style.color = 'red';
      failMessage.textContent = 'משהו השתבש, נסה שוב מאוחר יותר';
    } 
    else if (result.message === 'you have already confirmed your order, you cant add more products') {
      failMessage.style.color = 'red';
      failMessage.textContent = 'כבר שלחת את ההזמנה ולכן לא ניתן להוסיף עוד מוצרים';
    } 
    else if (result.message === 'quantity must be more than 0') {
      failMessage.style.color = 'red';
      failMessage.textContent = 'אי אפשר להכניס ערכים שלילים בכמות';
    } 
    else if (result.message === 'product added to cart successfully'){
      failMessage.style.color = 'green';
      failMessage.textContent = 'המוצר נוסף בהצלחה לעגלת הקניות'
     }
  } catch (error) {
      failMessage.textContent = 'משהו השתבש, נסה שוב מאוחר יותר';
      console.error(error);
  }
});

App().then((html) => {
  document.getElementById('root').innerHTML = html;
});  

function validatePositivity(){
  quantity.value > 0 ? quantity.setCustomValidity('') : quantity.setCustomValidity('אי אפשר להכניס ערכים שלילים בכמות');
}

async function App() {
  let products = [];

  async function fetchProducts() {
    try {
      const response = await fetch('/getAllProducts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      products = await response.json();
    } catch (error) {
      console.error('Error fetching products', error);
    }
  }

  await fetchProducts();

  function createCardsByType(products, type) {
    return products
      .filter((product) => product.type === type)
      .map((product) =>
        Card({
          img: product.img,
          productName: product.productName,
          price: product.price,
        })
      )
      .join('');
  }

  const shirtCards = createCardsByType(products, 'shirt');
  const sweaterCards = createCardsByType(products, 'sweater');
  const tankTopCards = createCardsByType(products, 'tank top');
  const pantsCards = createCardsByType(products, 'pants');
  const otherCards = createCardsByType(products, 'other');

  return `
    <div class="row text-center"><h3 class="text-center text-primary">חולצות</h3></div>
    <div class="row g-3">${shirtCards}</div>
    <div class="row text-center"><h3 class="text-center text-primary">סוודרים</h3></div>
    <div class="row g-3">${sweaterCards}</div>
    <div class="row text-center"><h3 class="text-center text-primary">גופיות</h3></div>
    <div class="row g-3">${tankTopCards}</div>
    <div class="row text-center"><h3 class="text-center text-primary">מכנסיים</h3></div>
    <div class="row g-3">${pantsCards}</div>
    <div class="row text-center"><h3 class="text-center text-primary">שונות</h3></div>
    <div class="row g-3">${otherCards}</div>
  `;
}

function Card({ img, productName, price }) {
  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
      <div class="card h-100">
        <div class="card-body text-center">
          <div class="mb-2">
            <img src="${img}" alt="${productName} img" class="img-fluid rounded" />
          </div>
          <div class="mb-2"><strong>${productName}</strong></div>
          <div class="mb-2">מחיר: ${price} ש"ח</div>
          <div>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addToCartModal" data-bs-product="${productName}" data-bs-price="${price}">
              הוסף לעגלה
            </button>
          </div>
        </div>
      </div>
    </div>`;
}
  


async function updateModal(productName, price) {
  //getting the product with dats-bs-product

  let response = await fetch('/getProductDetails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `productName=${productName}`,
  }).then(response => response.json());  

  let product = response;

  addToCartModal.querySelector('#productNameInput').value = product.productName;
  if (product.colors.length > 0) {
    const colorSelect = addToCartModal.querySelector('#colorSelect');
    colorSelect.innerHTML = '';
    product.colors.forEach((color) => {
      const option = document.createElement('option');
      option.value = color;
      option.textContent = color;
      colorSelect.appendChild(option);
    });  
  }  

  if (product.sizes.length > 0) {
    const sizeSelect = addToCartModal.querySelector('#sizeSelect');
    sizeSelect.innerHTML = '';
    product.sizes.forEach((size) => {
      const option = document.createElement('option');
      option.value = size;
      option.textContent = size;
      sizeSelect.appendChild(option);
    });  
    
  }  
  const modalTitle = addToCartModal.querySelector('#modalLabel');
  const productNameInput = addToCartModal.querySelector('#productNameInput');
  const priceInput = addToCartModal.querySelector('#priceInput');

  modalTitle.textContent = `המוצר שנבחר הוא ${productName}`;
  productNameInput.value = productName;
  priceInput.value = price;
};  

