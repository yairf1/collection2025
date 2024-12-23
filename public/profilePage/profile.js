let userName = document.getElementById('name');
let clas = document.getElementById('class');
let phone = document.getElementById('phone');
let email = document.getElementById('email');

let saveButton = document.getElementById('saveButton');
let resetButton = document.getElementById('resetButton');

//updateDetails();

saveButton.addEventListener('click', async (event) => {

    event.preventDefault();

    try{
        let response = await fetch('/profile/updateUserDetails', {
            method: 'Post',
            credentials: 'include',
            headers:{'content-Type': 'application/x-www-form-urlencoded'},
            body:`name=${userName.value}&class=${clas.value}&phone=${phone.value}&email=${email.value}`,
        }).then(response => response.text())
    }catch(err){
        console.error(err);
    }
    
    await updateDetails();
})

resetButton.addEventListener('click', async (event) => {
    event.preventDefault();
    await updateDetails();
})

async function updateDetails() {
    try{
        let user = await fetch('/profile/getUserDetails', {
            method: 'Get',
            Credentials:'include',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        })
        .then(response => response.json())

        userName.value = user.name;
        clas.value = user.class;
        phone.value = user.phone;
        email.value = user.email;
    }catch(err){
        console.error(err);
    }

}