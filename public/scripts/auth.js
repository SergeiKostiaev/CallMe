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

// Обработка отправки формы регистрации
document.getElementById('register').addEventListener('submit', async (event) => {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Пароли не совпадают!');
        return;
    }

    // Отправляем данные на сервер
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                nickname,
                password,
                confirmPassword
            })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Регистрация прошла успешно!');
            // Здесь можно добавить перенаправление или другую логику
            // Например, можно сразу авторизовать пользователя
            // window.location.href = '/path/to/some/page';
        } else {
            alert(data.message); // Показываем сообщение об ошибке
        }
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        alert('Ошибка при регистрации. Попробуйте еще раз.');
    }
});

// Обработка отправки формы авторизации
document.getElementById('login').addEventListener('submit', async (event) => {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Отправляем данные на сервер
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Авторизация прошла успешно!');
            // Здесь можно добавить перенаправление или другую логику
            // Например, можно перенаправить на страницу комнаты
            // window.location.href = '/path/to/room';
        } else {
            alert(data.message); // Показываем сообщение об ошибке
        }
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        alert('Ошибка при авторизации. Попробуйте еще раз.');
    }
});
