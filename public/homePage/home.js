const addToCartModal = document.getElementById('addToCartModal');
const failMessage = document.getElementById('failMessage');
const addToCartForm = document.getElementById('addToCartForm');

if (addToCartModal) {
  addToCartModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const productName = button.getAttribute('data-bs-product');
    const price = button.getAttribute('data-bs-price');
    addToCartModal.removeAttribute('aria-hidden')
    updateModal(productName, price);
  });
  addToCartModal.addEventListener('hide.bs.modal', event => {
    addToCartModal.setAttribute('aria-hidden', 'true');
  });
}

function Card({ img, productName, price }) {
  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
      <div class="card h-100">
        <div class="card-body text-center">
          <div class="mb-2">
            <img src="${img}" alt="${productName} img" class="img-fluid rounded" />
          </div>
          <div class="mb-2" id="productName">
            <strong>${productName}</strong>
          </div>
          <div class="mb-2" id="price">
            מחיר: ${price} ש"ח
          </div>
          <div>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addToCartModal" data-bs-product="${productName}" data-bs-price="${price}">
              הוסף לעגלה
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

async function App() {
  let products = [];

  async function fetchProducts() {
    try {
      const response = await fetch('/getAllProducts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      products = await response.json();
    } catch (error) {
      console.error('Error fetching products', error);
    }
  }

  await fetchProducts();

  const productCards = products.map((product) =>
    Card({
      img: product.img,
      productName: product.productName,
      price: product.price,
    })
  );

  return `<div class="row g-3">${productCards.join('')}</div>`;
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
     console.log(response.message);
     
     if (response.message === 'something went wrong') {
         failMessage.textContent = 'משהו השתבש, נסה שוב מאוחר יותר';
     } 
  } catch (error) {
      failMessage.textContent = 'משהו השתבש, נסה שוב מאוחר יותר';
      console.error(error);
  }
});


App().then((html) => {
  document.getElementById('root').innerHTML = html;
});
