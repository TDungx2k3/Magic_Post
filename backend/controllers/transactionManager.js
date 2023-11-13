const { sequelize } = require("../configdb/db");
const { Transaction } = require('../models/transactionsModel');
const { Account } = require("../models/accountsModel");
const { Order } = require("../models/ordersModel");
const { Delivery } = require("../models/deliveriesModel");

Order.hasMany(Delivery, {
    foreignKey: 'order_id'
})
Delivery.belongsTo(Order, {
    foreignKey: "order_id"
})

Transaction.hasMany(Delivery, {
    foreignKey: "to_id"
})
Delivery.belongsTo(Transaction, {
    foreignKey: "to_id"
})
class TransactionManager {
    getMaxTransId = async () => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            const allTranIds = await Transaction.findAll({
                attributes: ['trans_id'],
                raw: true,
            });
            return Math.max(...allTranIds.map((obj) => parseInt(obj.trans_id.substring(1))));
        } catch (error) {
            console.error("Lỗi khi lấy trans_id lớn nhất:", error);
            throw error;
        }
    };

    createAccountEmployee = async (req, res) => {
        const data = req.body;
        Account.create({
            account_id_: data.accountId,
            account_name: data.accountName,
            account_phone: data.accountPhone,
            account_password: data.accountPassword,
            role_id: 4,
            unit: data.unit,
        });
    };

    showAllOrderReceive = async (req, res) => {
        try {
            
            await sequelize.authenticate();
            await sequelize.sync();
            const allOrderReceive = await Order.findAll({
                attributes: ["order_id", "weight", "price"],
                include: [
                    {
                        model: Delivery,
                        attributes: ["to_id"],
                        where: {
                            date: req.body.deliveries.date
                        },
                        include: [
                            {
                                model: Transaction,
                                attributes: ["trans_id"]
                            }
                        ]
                    },
                ]
            });
            res.json(allOrderReceive);
            // return allOrderReceive[0].dataValues.deliveries;
        } catch (err) {
            console.error(err);
        }
    };
    
    showAllOrderSend = async (req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            const allOrderSend = await Order.findAll({
                attributes: ["order_id", "weight", "price"],
                include: [
                    {
                        model: Delivery,
                        where: {
                            date: req.body.deliveries.date
                        },
                        attributes: ["from_id"],
                        include: [
                            {
                                model: Transaction,
                                attributes: ["trans_id"]
                            }
                        ]
                    },
                ]
            });
            res.json(allOrderSend);
            // return allOrderReceive[0].dataValues.deliveries;
        } catch (err) {
            console.error(err);
        }
    };
};

module.exports = new TransactionManager();
