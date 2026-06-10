// === 1. ИНИЦИАЛИЗАЦИЯ ПЕРЕМЕННЫХ И КОРЗИНЫ ===
const cart = [];
const cartToggle = document.getElementById('cart-toggle');
const cartDiv = document.getElementById('cart');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

// Модальные окна
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('registration-modal');
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
const closeLogin = document.getElementById('close-login');
const closeRegister = document.getElementById('close-registration');

// === 2. ФУНКЦИИ ДЛЯ КОРЗИНЫ (РАБОТАЮТ КАК В ОРИГИНАЛЕ) ===
function addToCart(product, price) {
  const existingProduct = cart.find(item => item.product === product);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ product, price, quantity: 1 });
  }
  renderCart();
  if (cartDiv) cartDiv.classList.add('active');
}

function removeFromCart(product) {
  const index = cart.findIndex(item => item.product === product);
  if (index !== -1) {
    cart[index].quantity--;
    if (cart[index].quantity === 0) {
      cart.splice(index, 1);
    }
  }
  renderCart();
}

function renderCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  if (!cartItemsDiv) return;
  cartItemsDiv.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Корзина пуста</p>';
    // Проверяем оба варианта ID из твоей верстки, чтобы точно обнулить цену
    const totalSpan = document.getElementById('cart-total-price');
    const totalDiv = document.getElementById('cart-total');
    if (totalSpan) totalSpan.innerText = '0';
    if (totalDiv) totalDiv.innerText = `Итого: 0 ₽`;
    return;
  }

  cart.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.product}</h4>
        <p>${item.price} ₽ × ${item.quantity}</p>
      </div>
      <div class="cart-item-actions">
        <button onclick="removeFromCart('${item.product}')">-</button>
        <span>${item.quantity}</span>
        <button onclick="addToCart('${item.product}', ${item.price})">+</button>
      </div>
    `;
    cartItemsDiv.appendChild(itemDiv);
    total += item.price * item.quantity;
  });

  // Обновляем итоговую стоимость
  const totalSpan = document.getElementById('cart-total-price');
  const totalDiv = document.getElementById('cart-total');
  if (totalSpan) totalSpan.innerText = total;
  if (totalDiv) totalDiv.innerText = `Итого: ${total} ₽`;
}

function clearCart() {
  cart.length = 0;
  renderCart();
}

function closeCart() {
  if (cartDiv) cartDiv.classList.remove('active');
}

// Фикс оформления заказа: пустую корзину отправить нельзя!
function checkout() {
  if (cart.length === 0) {
    alert('Корзина пуста! Добавьте товары перед оформлением.');
    return;
  }
  alert('Заказ оформлен! Спасибо за покупку.');
  clearCart();
  closeCart();
}

// === 3. ОБРАБОТЧИКИ СОБЫТИЙ КОРЗИНЫ И МЕНЮ ===
if (cartToggle) {
  cartToggle.addEventListener('click', (e) => {
    e.preventDefault();
    if (cartDiv) cartDiv.classList.toggle('active');
  });
}

// Кнопка закрытия внутри корзины (если есть крестик)
const closeCartBtn = document.getElementById('close-cart');
if (closeCartBtn) {
  closeCartBtn.addEventListener('click', closeCart);
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    if (navMenu) navMenu.classList.toggle('active');
  });
  
  menuToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (navMenu) navMenu.classList.toggle('active');
    }
  });
}

// Открытие модальных окон
if (loginButton) {
  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (loginModal) loginModal.classList.add('active');
  });
}

if (registerButton) {
  registerButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (registerModal) registerModal.classList.add('active');
  });
}

// Закрытие модальных окон
if (closeLogin) {
  closeLogin.addEventListener('click', () => {
    if (loginModal) loginModal.classList.remove('active');
  });
}

if (closeRegister) {
  closeRegister.addEventListener('click', () => {
    if (registerModal) registerModal.classList.remove('active');
  });
}

window.addEventListener('click', (e) => {
  if (e.target === loginModal) loginModal.classList.remove('active');
  if (e.target === registerModal) registerModal.classList.remove('active');
});

// === 4. АВТОРИЗАЦИЯ И ОТОБРАЖЕНИЕ ПРОФИЛЯ ЛЮБОГО ЮЗЕРА ===
const authButtons = document.getElementById('auth-buttons');
const userInfo = document.getElementById('user-info');
const usernameDisplay = document.getElementById('username-display');
const userAvatar = document.getElementById('user-avatar');
const lkTitleName = document.querySelector('.profile-section .profile-info h2');

function updateAuthUI() {
  const currentUserName = localStorage.getItem('currentUser');

  if (currentUserName && currentUserName.trim() !== '') {
    // Юзер вошел — скрываем кнопки, показываем аватарку
    if (authButtons) authButtons.style.display = 'none';
    if (userInfo) {
      userInfo.style.display = 'block';
      userInfo.classList.remove('hidden');
    }
    if (usernameDisplay) usernameDisplay.textContent = currentUserName;
    if (userAvatar) userAvatar.textContent = currentUserName.charAt(0).toUpperCase();
    if (lkTitleName) lkTitleName.textContent = currentUserName;
  } else {
    // Гость — показываем Вход/Регистрация, скрываем аватарку
    if (authButtons) authButtons.style.display = 'block';
    if (userInfo) userInfo.style.display = 'none';
    if (lkTitleName) lkTitleName.textContent = "Гость (Авторизуйтесь)";
  }
}

// Обработка формы ВХОДА
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('login-email');
    let uName = "Пользователь";
    if (emailInput && emailInput.value) {
      uName = emailInput.value.split('@')[0]; // Никнейм из почты до знака @
    }
    localStorage.setItem('currentUser', uName);
    alert('Вход выполнен!');
    if (loginModal) loginModal.classList.remove('active');
    updateAuthUI();
  });
}

// Обработка формы РЕГИСТРАЦИИ
const registrationForm = document.getElementById('registration-form');
if (registrationForm) {
  registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById('reg-username');
    let uName = usernameInput && usernameInput.value ? usernameInput.value : "Пользователь";
    localStorage.setItem('currentUser', uName);
    alert('Регистрация успешна!');
    if (registerModal) registerModal.classList.remove('active');
    updateAuthUI();
  });
}

// Кнопка выхода (Выйти)
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
  logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    updateAuthUI();
    if (window.location.pathname.includes('kompani.html')) {
      window.location.href = 'index.html';
    }
  });
}

// Выпадающее меню профиля в шапке (если кликнуть на аватарку)
const profileMenuToggle = document.querySelector('.user-status');
const profileDropdown = document.getElementById('profile-dropdown');
if (profileMenuToggle && profileDropdown) {
  profileMenuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('active');
  });
  document.addEventListener('click', () => {
    profileDropdown.classList.remove('active');
  });
}

// Запуск проверки аккаунта при загрузке страницы
updateAuthUI();

// === 5. ПЛАВНАЯ ПРОКРУТКА СТРАНИЦЫ (КАК БЫЛО В ОРИГИНАЛЕ) ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
      
      // Закрытие мобильного меню
      if (navMenu && navMenu.classList.contains('active')) {
        if (menuToggle) menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    }
  });
});

// Инициализация корзины при старте страницы
renderCart();