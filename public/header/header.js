updateUI();

async function isLogged() {
  try {
    const response = await fetch('/checkAuth', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const text = await response.text();
    return text === 'user logged';
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function updateUI() {
  const login = document.getElementById('login');
  const register = document.getElementById('register');
  const logout = document.getElementById('logout');

  if (await isLogged()) {
    login.textContent = '';
    register.textContent = '';
    logout.textContent = 'התנתקות';
    login.setAttribute('href', '#');
    logout.setAttribute('onClick', 'logout()');
  } else {
    login.textContent = 'התחברות';
    login.setAttribute('href', '/login');
    register.textContent = 'הרשמה';
    register.setAttribute('href', '/register');
  }
};

async function logout() {
  try {
    const response = await fetch('/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const result = await response.json();
    if (result.message === 'logged out successfully') {
      window.location.href = '/login';
    } else {
      console.log(result.message);
    }
  } catch (error) {
    console.error(error);
  }
}
