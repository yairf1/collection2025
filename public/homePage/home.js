// const exampleModal = document.getElementById('exampleModal')
// if (exampleModal) {
//   exampleModal.addEventListener('show.bs.modal', event => {
//     // Button that triggered the modal
//     const button = event.relatedTarget
//     // Extract info from data-bs-* attributes
//     const recipient = button.getAttribute('data-bs-whatever')
//     // If necessary, you could initiate an Ajax request here
//     // and then do the updating in a callback.

//     // Update the modal's content.
//     const modalTitle = exampleModal.querySelector('.modal-title')
//     const modalBodyInput = exampleModal.querySelector('.modal-body input')

//     modalTitle.textContent = `New message to ${recipient}`
//     modalBodyInput.value = recipient
//   })
// }

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
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="${productName}">
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


App().then((html) => {
  document.getElementById('root').innerHTML = html;
});
