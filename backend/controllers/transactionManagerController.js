const { sequelize } = require("../configdb/db");
const { Transaction } = require('../models/transactionsModel');
const { Account } = require("../models/accountsModel");
const { Order } = require("../models/ordersModel");
const { Delivery } = require("../models/deliveriesModel");
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { where } = require("sequelize");

// Còn phải get được unit khi đăng nhập để làm điềU kiện where cho 2 cái thống kê hàng đi và đến

// Order.hasMany(Delivery, {
//     foreignKey: 'order_id'
// })
// Delivery.belongsTo(Order, {
//     foreignKey: "order_id"
// })

// Transaction.hasMany(Delivery, {
//     foreignKey: 'to_id'
// });
// Delivery.belongsTo(Transaction, {
//     foreignKey: 'trans_id'
// });

// Transaction.hasMany(Delivery, {
//     foreignKey: 'from_id'
// });
// Delivery.belongsTo(Transaction, {
//     foreignKey: 'trans_id'
// });

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
                unit: data.unit,
            });
        });
        res.send();
        console.log("akjfkaf" + data.accountPassword);
    };

    // showAllOrderReceived = async (req, res) => {
    //     try {

    //         await sequelize.authenticate();
    //         await sequelize.sync();
    //         const allOrderReceive = await Order.findAll({
    //             attributes: ["order_id", "weight", "price", "date"],
    //             include: [
    //                 {
    //                     model: Delivery,
    //                     attributes: ["to_id"],
    //                     where: {
    //                         // date: req.body.deliveries.date
    //                         to_id: "t01",
    //                         deliver_status: 1
    //                     },
    //                     include: [
    //                         {
    //                             model: Transaction,
    //                             attributes: ["trans_id"]
    //                         }
    //                     ]
    //                 },
    //             ]
    //         });
    //         res.json(allOrderReceive);
    //         // return allOrderReceive[0].dataValues.deliveries;
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    showAllOrderReceived = async (req, res) => {
        try {
            const data = req.query.unit
            const allOrdersReceived = await sequelize.query(
                "SELECT `orders`.order_id, `orders`.weight, `orders`.price, `orders`.date, `orders`.customer_name, `orders`.customer_phone, `orders`.receiver_name, `orders`.receiver_phone FROM `orders` JOIN deliveries ON orders.order_id = deliveries.order_id JOIN transactions ON deliveries.from_id = transactions.trans_id WHERE deliveries.to_id = :unit AND deliveries.deliver_status = 1 ORDER BY orders.date DESC",
                {
                    replacements: { unit : data}
                }
            );
            res.json(allOrdersReceived);
        }
        catch (err) {
            console.log(err);
            res.send(err);
        }
    }

    showAllOrderSent = async (req, res) => {
        try {
            const data = req.query.unit
            const allOrdersSent = await sequelize.query(
                "SELECT `orders`.order_id, `orders`.weight, `orders`.price, `orders`.date, `orders`.customer_name, `orders`.customer_phone, `orders`.receiver_name, `orders`.receiver_phone FROM `orders` JOIN deliveries ON orders.order_id = deliveries.order_id JOIN transactions ON deliveries.from_id = transactions.trans_id WHERE deliveries.from_id = :unit AND deliveries.deliver_status = 1 ORDER BY orders.date DESC",
                {
                    replacements: { unit : data}
                }
            );
            res.json(allOrdersSent);
        }
        catch (err) {
            console.log(err);
            res.send(err);
        }
    };

    getMaxDateSent = async (req, res) => {
        const unit = req.query.unit;
        try {
            const result = await sequelize.query("SELECT MAX(orders.date) FROM orders JOIN deliveries ON orders.order_id = deliveries.order_id JOIN transactions ON deliveries.from_id = transactions.trans_id WHERE transactions.trans_id = :unit",
            {
                replacements: { unit: unit }
            }
            );
            console.log(result);
            res.json(result);
        } catch (err) {
            console.log(err);
            res.json(err);
        }
    };

    getMaxDateReceived = async (req, res) => {
        const unit = req.query.unit;
        try {
            const result = await sequelize.query("SELECT MAX(orders.date) FROM orders JOIN deliveries ON orders.order_id = deliveries.order_id JOIN transactions ON deliveries.to_id = transactions.trans_id WHERE transactions.trans_id = :unit",
            {
                replacements: { unit: unit }
            }
            );
            res.json(result);
        } catch (err) {
            console.log(err);
            res.json(err);
        }
    };

    countOrderSentInADate = async (req, res) => {
        try {
            const date = req.query.date;
            const unit = req.query.unit;
    
            const count = await sequelize.query(
                `SELECT COUNT(*) 
                FROM (
                    SELECT orders.order_id
                    FROM orders 
                    JOIN deliveries ON orders.order_id = deliveries.order_id 
                    JOIN transactions ON transactions.trans_id = deliveries.from_id
                    WHERE orders.date = :date AND transactions.trans_id = :unit
                ) AS subquery`, 
                {
                    replacements: { 
                        date : date ,
                        unit: unit
                    }
                }
            );
            res.json(count[0]);
        } catch (err) {
            res.json(err);
        }
    }

    countOrderReceivedInADate = async (req, res) => {
        try {
            const date = req.query.date;
            const unit = req.query.unit;
    
            const count = await sequelize.query(
                `SELECT COUNT(*) 
                FROM (
                    SELECT orders.order_id
                    FROM orders 
                    JOIN deliveries ON orders.order_id = deliveries.order_id 
                    JOIN transactions ON transactions.trans_id = deliveries.to_id
                    WHERE orders.date = :date AND transactions.trans_id = :unit
                ) AS subquery`, 
                {
                    replacements: { 
                        date : date,
                        unit: unit
                    }
                }
            );
            console.log(count[0]);
            res.json(count[0]);
        } catch (err) {
            res.json(err);
        }
    }

    showDenyList = async (req, res) => {
        try {
            const unit = req.query.unit;

            const denyList = await sequelize.query("SELECT `orders`.order_id, `orders`.weight, `orders`.price, `orders`.date, `orders`.customer_name, `orders`.customer_phone, `orders`.receiver_name, `orders`.receiver_phone FROM `orders` JOIN deliveries ON orders.order_id = deliveries.order_id JOIN transactions ON deliveries.from_id = transactions.trans_id WHERE deliveries.from_id = :unit AND deliveries.deliver_status = 0 ORDER BY orders.date DESC",
            {
                replacements: { unit: unit }
            });
            res.json(denyList);
        }
        catch(err) {
            console.log(err);
            res.json(err);
        }
    }

    showLostOrderList = async (req, res) => {
        try {
            const unit = req.query.unit;

            const lostOrderList = await sequelize.query("SELECT `orders`.order_id, `orders`.weight, `orders`.price, `orders`.date, `orders`.customer_name, `orders`.customer_phone, `orders`.receiver_name, `orders`.receiver_phone FROM `orders` JOIN deliveries ON orders.order_id = deliveries.order_id JOIN transactions ON deliveries.to_id = transactions.trans_id WHERE deliveries.from_id = :unit AND deliveries.deliver_status = -1 ORDER BY orders.date DESC", 
                { replacements: { unit: unit } 
            });
            res.json(lostOrderList);
        }
        catch(err) {
            console.log(err);
            res.json(err);
        }
    }
};

module.exports = new transactionManagerController();
