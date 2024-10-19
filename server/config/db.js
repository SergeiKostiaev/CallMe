const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('callme_db', 'callme_user', 'yourpassword', {
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = sequelize;
