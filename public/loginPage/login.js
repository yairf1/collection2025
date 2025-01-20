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
            if(data.message == 'login successful'){
                window.location.href = '/';
            }
            else{
                if (data.message === 'Invalid credentials') { 
                    failTry.textContent = 'שם משתמש או סיסמה שגויים'
                }
                else if (data.message === 'An error occurred, please try again.') { 
                    failTry.textContent = 'קרתה שגיאה, נסה שנית מאוחר יותר'
                }
            }
        })
    }catch(err){
        console.error(err);
    }
})