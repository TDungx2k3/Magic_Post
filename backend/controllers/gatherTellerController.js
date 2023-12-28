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



class gatherTellerController {

    // chuyển định dạng ngày
    formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    };

    // lấy tất cả đơn chuyển đến điểm giao dịch
    getAllToTransactionOrder = async(req, res) => {
        let gId = req.query.unit;
        let validateGIdRs = Joi.string().regex(/^g\d+$/).required().validate(gId);
        if(validateGIdRs.error) {
            console.log(validateGIdRs.error);
        }
        else {
            try {
                await sequelize.authenticate();
                await sequelize.sync();
                const ordersToTrans = await Order.findAll({
                    include: [{
                        model: Delivery,
                        where: {
                            [Op.or]: [
                                { to_id: gId },
                                { from_id: gId },
                            ],
                            deliver_status: {
                                [Op.ne]: -1,
                            }
                        }
                    }],
                    where: {
                        steps: {
                            [Op.between]: [3, 5]
                        }
                    }
                });
                res.json(ordersToTrans);
            } catch (error) {
                console.log(error);
            };
        }
    };

    // lấy tất cả đơn chuyển từ điểm giao dịch đầu
    getAllFromTransactionOrder = async(req, res) => {
        let gId = req.query.unit;
        let validateGIdRs = Joi.string().regex(/^g\d+$/).required().validate(gId);
        if(validateGIdRs.error) {
            console.log(validateGIdRs.error);
        }
        else {
            try {
                await sequelize.authenticate();
                await sequelize.sync();
                const ordersFromTrans = await Order.findAll({
                    include: [{
                        model: Delivery,
                        where: {
                            [Op.or]: [
                                { to_id: gId },
                                { from_id: gId },
                            ], 
                            deliver_status: {
                                [Op.ne]: -1,
                            }
                        }
                    }],
                    where: {
                        steps: {
                            [Op.between]: [1, 3]
                        }
                    }
                });
                res.json(ordersFromTrans);
            } catch (error) {
                console.log(error);
            };
        }
    };

    // lấy điểm tập kết đầu
    getToGatherStep3 = async(tId) => {
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

    // chuyển đơn đến điểm tập kết đầu
    gatherToGatherStep3 = async(req, res) => {
        let gId = req.body.unit;
        let oId = req.body.order_id;
        let validateGIdRs = Joi.string().regex(/^g\d+$/).required().validate(gId);
        let validateOIdRs = Joi.number().positive().required().validate(oId);
        if(validateGIdRs.error || validateOIdRs.error) {
            console.log(validateGIdRs.error);
            console.log(validateOIdRs.error);
        }
        else {
            let toTrans = await Order.findAll({
                attributes: ["receiver_address"],
                where: {
                    order_id: oId,
                }
            });
            toTrans = toTrans[0].receiver_address.split("#")[1];
            // console.log(toTrans[0].receiver_address.split("#")[1]);
            let toGather = await this.getToGatherStep3(toTrans);
            try {
                await Delivery.create({
                    order_id: oId,
                    from_id: gId,
                    to_id: toGather[0].gather_id,
                    date: this.formatDate(new Date()),
                    deliver_status: 0,
                });
                await Order.update(
                    {
                        steps: 3
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

    // chuyển đơn đến điểm giao dịch đích
    gatherToTransStep5 = async(req, res) => {
        let gId = req.body.unit;
        let oId = req.body.order_id;
        let validateGIdRs = Joi.string().regex(/^g\d+$/).required().validate(gId);
        let validateOIdRs = Joi.number().positive().required().validate(oId);
        if(validateGIdRs.error || validateOIdRs.error) {
            console.log(validateGIdRs.error);
            console.log(validateOIdRs.error);
        }
        else {
            let toTrans = await Order.findAll({
                attributes: ["receiver_address"],
                where: {
                    order_id: oId,
                }
            });
            toTrans = toTrans[0].receiver_address.split("#")[1];
            try {
                await Delivery.create({
                    order_id: oId,
                    from_id: gId,
                    to_id: toTrans,
                    date: this.formatDate(new Date()),
                    deliver_status: 0,
                });
                await Order.update(
                    {
                        steps: 5
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

    // xác nhận thành công đơn hàng
    confirmSuccessStep1 = async(req, res) => {
        let gId = req.body.to_unit;
        let oId = req.body.order_id;
        let validateGIdRs = Joi.string().regex(/^g\d+$/).required().validate(gId);
        let validateOIdRs = Joi.number().positive().required().validate(oId);
        if(validateGIdRs.error || validateOIdRs.error) {
            console.log(validateGIdRs.error);
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
                            to_id: gId,
                        }
                    }
                );
                await Order.update(
                    {
                        steps: 2,
                        order_status: gId,
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

    // xác nhận đơn hàng đến thành công
    confirmSuccessStep3 = async(req, res) => {
        let gId = req.body.to_unit;
        let oId = req.body.order_id;
        let validateGIdRs = Joi.string().regex(/^g\d+$/).required().validate(gId);
        let validateOIdRs = Joi.number().positive().required().validate(oId);
        if(validateGIdRs.error || validateOIdRs.error) {
            console.log(validateGIdRs.error);
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
                            to_id: gId,
                        }
                    }
                );
                await Order.update(
                    {
                        steps: 4,
                        order_status: gId,
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


    // lấy đường đi đầu
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

    // lấy đường đi đích
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

    // tạo ra đơn hàng
    createOrder = async (req, res) => {
        const orderData = req.body;
        let cPhone = orderData.customer_phone;
        let validateCPhoneRs = Joi.string().required().pattern(/^0\d+$/).length(10).validate(cPhone);
        let rPhone = orderData.receiver_phone;
        let validateRPhoneRs = Joi.string().required().pattern(/^0\d+$/).length(10).validate(rPhone);
        let date = orderData.date;
        let validateDateRs = Joi.date().format('YYYY-MM-DD').validate(date);
        let weight = orderData.weight;
        let validateWeightRs = Joi.number().required().validate(weight);
        let price = orderData.price;
        let validatePriceRs = Joi.number().required().validate(price);
        console.log(validateDateRs);
        if(validateCPhoneRs.error
        || validateRPhoneRs.error
        || validateWeightRs.error
        || validatePriceRs.error) {
            console.log(validateCPhoneRs.error);
            console.log(validateRPhoneRs.error);
            console.log(validateWeightRs.error);
            console.log(validatePriceRs.error);
        }
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            await Order.create({
                customer_name: orderData.customer_name,
                customer_phone: cPhone,
                receiver_name: orderData.receiver_name,
                receiver_phone: rPhone,
                receiver_address: orderData.receiver_address,
                date: date,
                weight: weight,
                price: price,
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
    };

    // xử lý khi mất đơn hàng
    lostOrder = async(req, res) => {
        let dId = req.body.deliver_id;
        let oId = req.body.order_id;
        let validateDIdRs = Joi.number().positive().required().validate(dId);
        let validateOIdRs = Joi.number().positive().required().validate(oId);
        if(validateDIdRs.error || validateOIdRs.error) {
            console.log("d" + validateDIdRs.error);
            console.log(validateOIdRs.error);
        }
        else {
            
            try {
                await Delivery.update(
                    {
                        deliver_status: -1,
                    },
                    {
                        where: {
                            deliver_id: dId
                        }
                    }
                );
                await Order.update(
                    {
                        order_status: "lost",
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

    // xử lý khi bị khách hàng từ chối
    customerDeny = async(req, res) => {
        let dId = req.body.deliver_id;
        let oId = req.body.order_id;
        let validateDIdRs = Joi.number().positive().required().validate(dId);
        let validateOIdRs = Joi.number().positive().required().validate(oId);
        if(validateDIdRs.error || validateOIdRs.error) {
            console.log("d" + validateDIdRs.error);
            console.log(validateOIdRs.error);
        }
        else {
            
            try {
                await Delivery.update(
                    {
                        deliver_status: -1,
                    },
                    {
                        where: {
                            deliver_id: dId
                        }
                    }
                );
                await Order.update(
                    {
                        order_status: "deny",
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

    // lấy thông tin điểm tập kết
    getGatherUnit = async(req, res) => {
        let oId = req.query.order_id;
        let validateOIdRs = Joi.number().positive().required().validate(oId);
        if(validateOIdRs.error) {
            console.log(validateOIdRs.error);
        }
        else {
            let toTrans = await Order.findAll({
                attributes: ["receiver_address"],
                where: {
                    order_id: oId,
                }
            });
            toTrans = toTrans[0].receiver_address.split("#")[1];
            // console.log(toTrans[0].receiver_address.split("#")[1]);
            let toGather = await this.getToGatherStep3(toTrans);
            res.json(toGather);
        }
    }
};

module.exports = new gatherTellerController();
