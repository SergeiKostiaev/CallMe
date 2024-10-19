const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');  // Импортируем bcrypt
const User = require('../models/User');

const router = express.Router();

// Регистрация пользователя
router.post('/register', async (req, res) => {
    const { name, email, nickname, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            nickname,
            password: hashedPassword,  // Сохраняем хешированный пароль
        });

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(201).json({
            token,
            user: {
                email: user.email,
                nickname: user.nickname,
            }
        });
    } catch (error) {
        console.error(error);  // Логируем ошибку для отладки
        res.status(500).json({ message: 'Server error' });
    }
});

// Вход пользователя
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Проверяем пароль
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({
            token,
            user: {
                email: user.email,
                nickname: user.nickname,
            }
        });
    } catch (error) {
        console.error(error);  // Логируем ошибку для отладки
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
