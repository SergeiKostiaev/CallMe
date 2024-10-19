const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('callMe', 'test', 'test', {
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
