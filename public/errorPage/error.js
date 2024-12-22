function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
}
    
let loginMessage = document.getElementById('loginMessage');
if (getCookie('isLogged')) {
    loginMessage.style.display = 'none';
}else{
    loginMessage.style.display = 'block';
}
