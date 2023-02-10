const { DataTypes } = require('sequelize');
const db = require('../db/conn')

const Tought = db.define('Tought', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
})

//ligação com user
const User = require('./User');

Tought.belongsTo(User)
User.hasMany(Tought)

module.exports = Tought
