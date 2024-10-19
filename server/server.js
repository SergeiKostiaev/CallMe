const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { ExpressPeerServer } = require('peer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Настройка PeerJS
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.use('/api', require('./routes/auth'));

// Подключение PeerJS к вашему серверу
app.use('/peerjs', peerServer);

// Указываем путь к статическим файлам
app.use(express.static(path.join(__dirname, '../public')));

// Обработка GET-запроса для главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Обработка соединений с Socket.IO
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Обработка запроса на присоединение к комнате
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
        socket.broadcast.to(roomId).emit('user-connected', userId);

        // Обработка отключения пользователя
        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected from room ${roomId}`);
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
        });
    });
});

// Запуск сервера на порту 3000
server.listen(3000, () => {
    console.log('Server running on port 3000');
});
