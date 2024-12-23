let form = document.getElementById('loginForm');
let failTry = document.getElementById('failMessage');

form.addEventListener('submit', async(event) => {
    let name = document.getElementById('name').value;
    let password = document.getElementById('password').value;

    event.preventDefault();
    try{
        await fetch('/login/checkIfExist', {
            method:'Post',
            Credential:'include',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            body:`name=${name}&password=${password}`
        })
        .then(response=>response.json())
        .then(data=>{
            if(data.flag){
                window.location.href = data.router;
            }
            else{
            failTry.textContent = data.error;
            }
        })
    }catch(err){
        console.error(err);
    }
})