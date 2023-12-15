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

    formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    };
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
                            [Op.or]: [
                                { to_id: tId },
                                { from_id: tId },
                            ]
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
                const ordersFromCustomer = await Order.findAll({
                    include: [{
                        model: Delivery,
                        where: {
                            [Op.or]: [
                                { to_id: tId },
                                { from_id: tId },
                            ]
                        }
                    }],
                    where: {
                        steps: {
                            [Op.between]: [0, 1]
                        }
                    }
                });
                res.json(ordersFromCustomer);
            } catch (error) {
                console.log(error);
            };
        }
    };

    getToGatherStep1 = async(tId) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            const toGather = await Transaction.findAll({
                attributes: ["gather_id"],
                where: {
                    trans_id: tId,
                }
            });
            
            return toGather;
        } catch (error) {
            console.log(error);
        };
    }

    transToGatherStep1 = async(req, res) => {
        let tId = req.body.unit;
        let oId = req.body.order_id;
        let validateTIdRs = Joi.string().regex(/^t\d+$/).required().validate(tId);
        let validateOIdRs = Joi.number().positive().required().validate(oId);
        if(validateTIdRs.error || validateOIdRs.error) {
            console.log(validateTIdRs.error);
            console.log(validateOIdRs.error);
        }
        else {
            let toGather = await this.getToGatherStep1(tId);
            try {
                await Delivery.create({
                    order_id: oId,
                    from_id: tId,
                    to_id: toGather[0].gather_id,
                    date: this.formatDate(new Date()),
                    deliver_status: 0,
                });
                await Order.update(
                    {
                        steps: 1
                    },
                    {
                        where: {
                            order_id: oId,
                        }
                    }
                );
                res.send();
            } catch (error) {
                console.log(error);
            }
        }
    };

    confirmSuccessStep5 = async(req, res) => {
        let tId = req.body.unit;
        let oId = req.body.order_id;
        let validateTIdRs = Joi.string().regex(/^t\d+$/).required().validate(tId);
        let validateOIdRs = Joi.number().positive().required().validate(oId);
        if(validateTIdRs.error || validateOIdRs.error) {
            console.log(validateTIdRs.error);
            console.log(validateOIdRs.error);
        }
        else {
            
            try {
                await Delivery.update(
                    {
                        deliver_status: 1,
                    },
                    {
                        where: {
                            order_id: oId,
                            to_id: tId,
                        }
                    }
                );
                await Order.update(
                    {
                        steps: 6,
                        order_status: tId,
                    },
                    {
                        where: {
                            order_id: oId,
                        }
                    }
                );
                res.send();
            } catch (error) {
                console.log(error);
            }
        }
    }

    transToCustomerStep7 = async(req, res) => {
        let tId = req.body.unit;
        let oId = req.body.order_id;
        let validateTIdRs = Joi.string().regex(/^t\d+$/).required().validate(tId);
        let validateOIdRs = Joi.number().positive().required().validate(oId);
        if(validateTIdRs.error || validateOIdRs.error) {
            console.log(validateTIdRs.error);
            console.log(validateOIdRs.error);
        }
        else {
            
            try {
                await Delivery.create({
                    order_id: oId,
                    from_id: tId,
                    to_id: "r",
                    date: this.formatDate(new Date()),
                    deliver_status: 0,
                });
                await Order.update(
                    {
                        steps: 7,
                    },
                    {
                        where: {
                            order_id: oId,
                        }
                    }
                );
                res.send();
            } catch (error) {
                console.log(error);
            }
        }
    };

    customerAccept = async(req, res) => {
        let oId = req.body.order_id;
        let validateOIdRs = Joi.number().positive().required().validate(oId);
        if(validateOIdRs.error) {
            console.log(validateOIdRs.error);
        }
        else {
            
            try {
                await Delivery.update(
                    {
                        deliver_status: 1,
                    },
                    {
                        where: {
                            order_id: oId,
                        }
                    }
                );
                await Order.update(
                    {
                        steps: 8,
                        order_status: "done",
                    },
                    {
                        where: {
                            order_id: oId,
                        }
                    }
                );
                res.send();
            } catch (error) {
                console.log(error);
            }
        }
    }


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
                transactionStart: pathStart.trans_id,
                gatherStart: pathStart.gathering.gather_id,
            });
        } catch (error) {
            console.log(error);
        };
    }

    getPathEnd = async (req, res) => {
        let receiverTransId = req.query.trans_id;
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            const pathEnd = await Transaction.findOne({
                where: {
                    trans_id: receiverTransId,
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


    showAllGathers = async (req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            let gathers = [];
            gathers = await Gathering.findAll();
            res.json(gathers);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };

    showAllTransactionsByGather = async (req, res) => {
        const data = req.query.gather_id;
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            let transactions = [];
            transactions = await Transaction.findAll({
                where: {
                    gather_id: data,
                }
            });
            res.json(transactions);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };

};

module.exports = new transactionTellerController();
