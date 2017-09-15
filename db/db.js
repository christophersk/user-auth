const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/user-auth');

module.exports = db;
