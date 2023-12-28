const { sequelize } = require("../configdb/db");
const { Transaction } = require('../models/transactionsModel');
const { Account } = require("../models/accountsModel");
const { Order } = require("../models/ordersModel");
const { Delivery } = require("../models/deliveriesModel");
const bcrypt = require('bcrypt');
const Joi = require('joi');

class transactionManagerController {
    createAccountEmployee = async (req, res) => {
        const data = req.body;
        let aPhone = req.body.accountPhone;
        let mPass = req.body.accountPassword;
        let unit = req.body.unit;
        let validateUnitRs = Joi.string().regex(/^[gt]\d+$/).required().validate(unit);
        let validateAPassRs = Joi.string().required().min(6).max(30).validate(mPass)
        let validateAPhoneRs = Joi.string().required().pattern(/^0\d+$/).length(10).validate(aPhone);
        if(validateAPassRs.error
        || validateUnitRs.error
        || validateAPhoneRs.error) {
            console.log(validateAPassRs.error);
            console.log(validateUnitRs.error);
            console.log(validateAPhoneRs.error);
        }
        else {
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
                    account_phone: aPhone,
                    account_password: hash,
                    role_id: 3,
                    unit: unit,
                });
            });
            res.send();
        }
    };

    showAllOrderReceived = async (req, res) => {
        try {
            const data = req.query.unit
            const allOrdersReceived = await sequelize.query(
                "SELECT `orders`.order_id, `orders`.weight, `orders`.price, `orders`.date, `orders`.customer_name, `orders`.customer_phone, `orders`.receiver_name, `orders`.receiver_phone FROM `orders` JOIN deliveries ON orders.order_id = deliveries.order_id JOIN transactions ON deliveries.to_id = transactions.trans_id WHERE deliveries.to_id = :unit AND orders.steps >= 6 ORDER BY orders.date DESC",
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
    };

    showAllOrderSent = async (req, res) => {
        try {
            const data = req.query.unit
            const allOrdersSent = await sequelize.query(
                "SELECT `orders`.order_id, `orders`.weight, `orders`.price, `orders`.date, `orders`.customer_name, `orders`.customer_phone, `orders`.receiver_name, `orders`.receiver_phone FROM `orders` JOIN deliveries ON orders.order_id = deliveries.order_id JOIN transactions ON deliveries.from_id = transactions.trans_id WHERE deliveries.from_id = :unit AND orders.steps > 0 ORDER BY orders.date DESC",
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
                    WHERE orders.date = :date AND transactions.trans_id = :unit AND orders.steps > 0
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
    };

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
                    WHERE orders.date = :date AND transactions.trans_id = :unit AND orders.steps >= 6
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
    };

    showDenyList = async (req, res) => {
        try {
            const unit = req.query.unit;

            const denyList = await sequelize.query("SELECT `orders`.order_id, `orders`.weight, `orders`.price, `orders`.date, `orders`.customer_name, `orders`.customer_phone, `orders`.receiver_name, `orders`.receiver_phone FROM `orders` JOIN deliveries ON orders.order_id = deliveries.order_id JOIN transactions ON deliveries.from_id = transactions.trans_id WHERE deliveries.from_id = :unit AND deliveries.deliver_status = -1 AND deliveries.to_id = :r ORDER BY orders.date DESC",
            {
                replacements: { 
                    unit: unit,
                    r: "r" 
                }
            });
            res.json(denyList);
        }
        catch(err) {
            console.log(err);
            res.json(err);
        }
    };

    showLostOrderList = async (req, res) => {
        try {
            const unit = req.query.unit;

            const lostOrderList = await sequelize.query("SELECT `orders`.order_id, `orders`.weight, `orders`.price, `orders`.date, `orders`.customer_name, `orders`.customer_phone, `orders`.receiver_name, `orders`.receiver_phone FROM `orders` JOIN deliveries ON orders.order_id = deliveries.order_id JOIN transactions ON deliveries.to_id = transactions.trans_id WHERE deliveries.from_id = :unit AND deliveries.deliver_status = -1 AND orders.order_status = :lost ORDER BY orders.date DESC", 
                { replacements: { unit: unit, lost: "lost" } 
            });
            res.json(lostOrderList);
        }
        catch(err) {
            console.log(err);
            res.json(err);
        }
    };
};

module.exports = new transactionManagerController();
