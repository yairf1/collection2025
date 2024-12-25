let userName = document.getElementById('name');
let clas = document.getElementById('class');
let phone = document.getElementById('phone');
let email = document.getElementById('email');

let saveButton = document.getElementById('saveButton');
let resetButton = document.getElementById('resetButton');

updateDetails();

saveButton.addEventListener('click', async (event) => {
    event.preventDefault();

    try {
        let response = await fetch('/profile/updateUserDetails', {
            method: 'POST',  
            credentials: 'include', 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `name=${userName.value}&clas=${clas.value}&phone=${phone.value}&email=${email.value}`,
        }).then(response => response.json());
    } catch (err) {
        console.error(err);
    }
    
    await updateDetails();
});

resetButton.addEventListener('click', async (event) => {
    event.preventDefault();
    await updateDetails();
});

async function updateDetails() {
    try {
        let user = await fetch('/profile/getUserDetails', {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }).then(response => response.json())
        .then(user => {
            userName.value = user.name;
            clas.value = user.clas;
            phone.value = user.phone;
            email.value = user.email;
        })

    } catch (err) {
        console.error(err);
    }
}
