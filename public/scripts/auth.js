// Получаем элементы формы и ссылки для переключения
const registrationContainer = document.getElementById('registration-form');
const loginContainer = document.getElementById('login-form');
const showLoginLink = document.getElementById('show-login');
const showRegisterLink = document.getElementById('show-register');

// Добавляем обработчик клика на ссылку для показа формы авторизации
showLoginLink.addEventListener('click', function (e) {
    e.preventDefault();  // предотвращаем переход по ссылке
    registrationContainer.style.display = 'none';  // скрываем форму регистрации
    loginContainer.style.display = 'block';  // показываем форму авторизации
});

// Добавляем обработчик клика на ссылку для показа формы регистрации
showRegisterLink.addEventListener('click', function (e) {
    e.preventDefault();  // предотвращаем переход по ссылке
    loginContainer.style.display = 'none';  // скрываем форму авторизации
    registrationContainer.style.display = 'block';  // показываем форму регистрации
});
