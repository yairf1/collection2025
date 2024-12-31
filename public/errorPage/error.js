async function isLogged() {
  try {
    const response = await fetch('/checkAuth', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const text = await response.text();
    return text === 'user logged' ? true : false;
  } catch (error) {
    console.error(error);
    return false;
  }
}
    
let loginMessage = document.getElementById('loginMessage');
if (isLogged()) {
    loginMessage.style.display = 'none';
}else{
    loginMessage.style.display = 'block';
}
