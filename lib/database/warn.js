const {DataTypes} = require('sequelize');
var sequelize = require('../database');
const GroupWarns = sequelize.define('GroupWarns', {
    group: {type: DataTypes.STRING,allowNull: false},
    user: {type: DataTypes.STRING,allowNull: false},
    warns: {type: DataTypes.INTEGER,defaultValue: 0
    }}, {tableName: 'group_warns',timestamps: true
});

module.exports = GroupWarns;
