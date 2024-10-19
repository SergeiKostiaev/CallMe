const registrationForm = document.getElementById('register');
const loginForm = document.getElementById('login');

registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const nickname = document.getElementById('nickname').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Проверка на пустые поля
    if (!name || !email || !nickname || !password || !confirmPassword) {
        return console.error('Все поля обязательны.');
    }

    // Проверка на совпадение паролей
    if (password !== confirmPassword) {
        return console.error('Пароли не совпадают.');
    }

    try {
        const response = await fetch('/register', { // Убедитесь, что путь к API правильный
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Устанавливаем заголовок
            },
            body: JSON.stringify({
                name,
                email,
                nickname,
                password,
                confirmPassword,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при регистрации');
        }

        const data = await response.json();
        console.log('Регистрация успешна:', data);
        // Здесь можно выполнить дополнительные действия, например, перейти на другую страницу
    } catch (error) {
        console.error('Ошибка при регистрации:', error.message);
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    // Проверка на пустые поля
    if (!email || !password) {
        return console.error('Email и пароль обязательны.');
    }

    try {
        const response = await fetch('/login', { // Убедитесь, что путь к API правильный
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Устанавливаем заголовок
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при входе');
        }

        const data = await response.json();
        console.log('Вход успешен:', data);
        // Здесь можно выполнить дополнительные действия, например, перейти на другую страницу
    } catch (error) {
        console.error('Ошибка при входе:', error.message);
    }
});
