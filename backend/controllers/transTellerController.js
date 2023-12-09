const { sequelize , Op } = require("../configdb/db");
const { Transaction } = require('../models/transactionsModel');
const { Account } = require("../models/accountsModel");
const { Order } = require("../models/ordersModel");
const { Delivery } = require("../models/deliveriesModel");
const { Gathering } = require("../models/gatheringsModel");
const bcrypt = require('bcrypt');
const Joi = require('joi');

Order.hasMany(Delivery, {
    foreignKey: 'order_id'
});
Delivery.belongsTo(Order, {
    foreignKey: "order_id"
});

Gathering.hasMany(Account, {
    foreignKey: 'account_id'
});
Account.belongsTo(Gathering, {
    foreignKey: 'account_id'
});

Gathering.hasMany(Transaction, {
    foreignKey: 'gather_id'
});
Transaction.belongsTo(Gathering, {
    foreignKey: 'gather_id'
})



class transactionTellerController {
    getAllToCustomerOrder = async(req, res) => {
        let tId = req.query.unit;
        let validateTIdRs = Joi.string().regex(/^t\d+$/).required().validate(tId);
        if(validateTIdRs.error) {
            console.log(validateTIdRs.error);
        }
        else {
            try {
                await sequelize.authenticate();
                await sequelize.sync();
                const ordersToCustomer = await Order.findAll({
                    include: [{
                        model: Delivery,
                        where: {
                            to_id: tId,
                        }
                    }],
                    where: {
                        steps: {
                            [Op.between]: [5, 7]
                        }
                    }
                });
                res.json(ordersToCustomer);
            } catch (error) {
                console.log(error);
            };
        }
    };

    getAllFromCustomerOrder = async(req, res) => {
        let tId = req.query.unit;
        let validateTIdRs = Joi.string().regex(/^t\d+$/).required().validate(tId);
        if(validateTIdRs.error) {
            console.log(validateTIdRs.error);
        }
        else {
            try {
                await sequelize.authenticate();
                await sequelize.sync();
                const ordersToCustomer = await Order.findAll({
                    include: [{
                        model: Delivery,
                        where: {
                            to_id: tId,
                        }
                    }],
                    where: {
                        steps: {
                            [Op.between]: [0, 1]
                        }
                    }
                });
                res.json(ordersToCustomer);
            } catch (error) {
                console.log(error);
            };
        }
    };

    getPathStart = async (req, res) => {
        //let transactionId = req.query.unit;
        let transactionId = req.query.unit;
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            const pathStart = await Transaction.findOne({
                where: {
                    trans_id: transactionId,
                },
                include: [{
                    model: Gathering,
                }]
            });
            //res.json(pathStart);
            res.json({
                transactionStart: pathStart.trans_name,
                gatherStart: pathStart.gathering.gather_name,
            });
        } catch (error) {
            console.log(error);
        };
    }

    getPathEnd = async (req, res) => {
        let receiverAddress = req.query.address;
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            const pathEnd = await Transaction.findOne({
                where: {
                    trans_name: receiverAddress,
                },
                include: [{
                    model: Gathering,
                }]
            });
            if(pathEnd) {
                res.json({
                    transactionEnd: pathEnd.trans_name,
                    gatherEnd: pathEnd.gathering.gather_name,
                    message: "Hợp lệ",
                });
            } else {
                res.json({
                    message: "Tên tỉnh thành không đúng hoặc địa chỉ sai định dạng.",
                })
            }
        } catch (error) {
            console.log(error);
        };
    }

    createOrder = async (req, res) => {
        const orderData = req.body;
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            await Order.create({
                customer_name: orderData.customer_name,
                customer_phone: orderData.customer_phone,
                receiver_name: orderData.receiver_name,
                receiver_phone: orderData.receiver_phone,
                receiver_address: orderData.receiver_address,
                date: orderData.date,
                weight: orderData.weight,
                price: orderData.price,
                description: orderData.description,
                order_status: "1",
                steps: 0,
            })
            .then(() => {
                res.json("Tạo thành công 1 đơn hàng");
            })
            .catch(error => {
                res.json("Lỗi khi tạo đơn hàng" + error.message);
            })
        } catch (error) {
            console.log(error);
        };
    }
};

module.exports = new transactionTellerController();
