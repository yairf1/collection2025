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

