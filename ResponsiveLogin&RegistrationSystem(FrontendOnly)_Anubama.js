const loginToggle = document.getElementById('login-toggle');
const registerToggle = document.getElementById('register-toggle');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const welcomeMessage = document.getElementById('welcome-message');
const logoutBtn = document.getElementById('logout-btn');

function showLogin() {
  loginToggle.classList.add('active');
  registerToggle.classList.remove('active');
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
}
function showRegister() {
  registerToggle.classList.add('active');
  loginToggle.classList.remove('active');
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
}
loginToggle.addEventListener('click', showLogin);
registerToggle.addEventListener('click', showRegister);

// Password show/hide logic
document.querySelectorAll('.toggle-password').forEach(toggle => {
  toggle.addEventListener('click', function() {
    const targetId = this.getAttribute('data-target');
    const input = document.getElementById(targetId);
    if (input.type === 'password') {
      input.type = 'text';
      this.textContent = '🙈';
    } else {
      input.type = 'password';
      this.textContent = '👁️';
    }
  });
});

// Email validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
// Password strength: min 6 chars, at least 1 letter and 1 number
function isStrongPassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
}

// Registration logic
registerForm.addEventListener('submit', function(e) {
  e.preventDefault();
  // Clear previous errors
  document.getElementById('register-email-error').textContent = '';
  document.getElementById('register-password-error').textContent = '';
  document.getElementById('register-confirm-password-error').textContent = '';
  document.getElementById('register-success').textContent = '';

  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;

  let valid = true;
  if (!isValidEmail(email)) {
    document.getElementById('register-email-error').textContent = 'Invalid email address.';
    valid = false;
  }
  if (!isStrongPassword(password)) {
    document.getElementById('register-password-error').textContent = 'Password must be at least 6 characters, include a letter and a number.';
    valid = false;
  }
  if (password !== confirmPassword) {
    document.getElementById('register-confirm-password-error').textContent = 'Passwords do not match.';
    valid = false;
  }
  if (!valid) return;

  // Save to localStorage
  localStorage.setItem('user', JSON.stringify({ email, password }));
  document.getElementById('register-success').textContent = 'Registration successful! You can now log in.';
  setTimeout(() => {
    showLogin();
    registerForm.reset();
    document.getElementById('register-success').textContent = '';
  }, 1200);
});

// Login logic
loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  document.getElementById('login-email-error').textContent = '';
  document.getElementById('login-password-error').textContent = '';
  document.getElementById('login-success').textContent = '';

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const user = JSON.parse(localStorage.getItem('user'));

  let valid = true;
  if (!isValidEmail(email)) {
    document.getElementById('login-email-error').textContent = 'Invalid email address.';
    valid = false;
  }
  if (!password) {
    document.getElementById('login-password-error').textContent = 'Password required.';
    valid = false;
  }
  if (!valid) return;

  if (!user || user.email !== email || user.password !== password) {
    document.getElementById('login-password-error').textContent = 'Incorrect email or password.';
    return;
  }
  // Mock login state
  localStorage.setItem('loggedIn', 'true');
  showWelcome();
});

function showWelcome() {
  loginForm.classList.remove('active');
  registerForm.classList.remove('active');
  document.querySelector('.form-toggle').style.display = 'none';
  welcomeMessage.classList.remove('hidden');
}
function hideWelcome() {
  welcomeMessage.classList.add('hidden');
  document.querySelector('.form-toggle').style.display = 'flex';
  showLogin();
  loginForm.reset();
  registerForm.reset();
  localStorage.removeItem('loggedIn');
}
logoutBtn.addEventListener('click', hideWelcome);

// On page load, check login state
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('loggedIn') === 'true') {
    showWelcome();
  } else {
    hideWelcome();
  }
});
