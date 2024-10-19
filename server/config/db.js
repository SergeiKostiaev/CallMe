const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('callme_db', 'callme_user', 'yourpassword', {
    host: 'localhost',
    dialect: 'postgres'
});

// Проверка подключения
const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Соединение с базой данных успешно установлено.');
    } catch (error) {
        console.error('Не удалось подключиться к базе данных:', error);
    }
};

connectToDatabase();

module.exports = sequelize;
