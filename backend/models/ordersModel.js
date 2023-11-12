const { DataTypes} = require("sequelize");
const { sequelize } = require("../configdb/db");

const Order = sequelize.define(
    "orders",
    {
        order_id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        customer_name: {
            type: DataTypes.TEXT,
            allowNull: false,   
        },
        customer_phone: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        receiver_name: {
            type: DataTypes.TEXT,
            allowNull: false,  
        },
        receiver_phone: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        receiver_address: {
            type: DataTypes.TEXT,
            allowNull: false, 
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        weight: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        order_status: {
            type: DataTypes.STRING(5),
            allowNull: false,
        },
        steps: {
            type: DataTypes.INTEGER(2),
            allowNull: false,
        }
    },
    {
        timestamps: false, // Unable timestamps
    }
);

Order.sync({ force: false }).then(() => {
    console.log("Order đã được đồng bộ hóa với cơ sở dữ liệu.");
  });
  
  module.exports = { Order };