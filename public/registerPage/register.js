let form = document.getElementById('registerForm');
let failTry = document.getElementById('failMessage');
let loadingSpinners = document.getElementById('loadingSpinners');

form.addEventListener('submit', async(event) => {
    let name = document.getElementById('name').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;
    let clas = document.getElementById('class').value;
    let phone = document.getElementById('phone').value;
    let email = document.getElementById('email').value;
    
    loadingSpinners.style.display = 'block';
    event.preventDefault();
    
    if (password == confirmPassword) {
        try{
            await fetch('/register/createUser', {
                method:'Post',
                Credential:'include',
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                body:`name=${name.trim()}&password=${password}&clas=${clas}&phone=${phone}&email=${email}`
            })
            .then(async (response) => {
                const data = await response.json()
                loadingSpinners.style.display = 'none';
                if (data.message == 'user created successfully') {
                    window.location.href = '/login'
                } else {
                    failTry.textContent = 'קרתה שגיאה, נסה שם משתמש אחר ואם הבעיה לא נפתרת נסה שוב מאוחר יותר';
                }
            })
        }catch(err){
            console.error(err);
        }
    } else {
        loadingSpinners.style.display = 'none';
        failTry.textContent = 'סיסמאות אינן זהות, נסה שנית'
    }
});

