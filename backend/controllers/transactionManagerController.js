const { sequelize } = require("../configdb/db");
const { Transaction } = require('../models/transactionsModel');
const { Account } = require("../models/accountsModel");
const { Order } = require("../models/ordersModel");
const { Delivery } = require("../models/deliveriesModel");
const bcrypt = require('bcrypt');

Order.hasMany(Delivery, {
    foreignKey: 'order_id'
})
Delivery.belongsTo(Order, {
    foreignKey: "order_id"
})

Transaction.hasMany(Delivery, {
    foreignKey: 'to_id',
    as: 'toDeliveries'
});
Delivery.belongsTo(Transaction, {
    foreignKey: 'trans_id',
    as: 'toTransaction' 
});

Transaction.hasMany(Delivery, {
    foreignKey: 'from_id',
    as: 'fromDeliveries'
});
Delivery.belongsTo(Transaction, {
    foreignKey: 'trans_id',
    as: 'fromTransaction'
});

class transactionManagerController {
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
        const saltRounds = 10;
        const plaintextPassword = data.accountPassword;
        bcrypt.hash(plaintextPassword, saltRounds, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
            } else {
                data.accountPassword = hash;
            }
            Account.create({
                account_name: data.accountName,
                account_phone: data.accountPhone,
                account_password: data.accountPassword,
                role_id: 3,
                unit: "test",
            });
        });
        res.send();
        console.log("akjfkaf" + data.accountPassword);
    };

    showAllOrderReceived = async (req, res) => {
        try {

            await sequelize.authenticate();
            await sequelize.sync();
            const allOrderReceive = await Order.findAll({
                attributes: ["order_id", "weight", "price", "date"],
                include: [
                    {
                        model: Delivery,
                        attributes: ["to_id"],
                        where: {
                            // date: req.body.deliveries.date
                            to_id: "t01",
                            deliver_status: 1
                        },
                        include: [
                            {
                                model: Transaction,
                                attributes: ["trans_id"],
                                as: "toTransaction"
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

    showAllOrderSent = async (req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            const allOrderSent = await Order.findAll({
                attributes: ["order_id", "weight", "price", "date"],
                include: [
                    {
                        model: Delivery,
                        where: {
                            deliver_status: 1,
                            from_id: "t01"
                            // date: req.body.deliveries.date
                        },
                        attributes: ["from_id"],
                        include: [
                            {
                                model: Transaction,
                                attributes: ["trans_id"],
                                as: "fromTransaction"
                            }
                        ],
                        required: true
                    },
                ]
            });
            res.json(allOrderSent);
            // return allOrderSent;
        } catch (err) {
            console.error(err);
        }
    };

};

module.exports = new transactionManagerController();
