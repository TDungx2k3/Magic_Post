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

    // chỉnh ngày theo đúng format
    formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    };

    // lấy tất cả đơn hàng chuyển đến khách hàng
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

    // lấy tất cả đơn khách gửi
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

    // lấy đơn chuyển từ điểm giao dịch đến điểm tập kết đầu 
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

    // chuyển từ điểm giao dịch đến điểm tập kết đầu 
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

    // Xác nhận đã đến thành công khi chuyển từ điểm tập kết đến điểm giao dịch đích
    confirmSuccessStep5 = async(req, res) => {
        let tId = req.body.to_unit;
        let oId = req.body.order_id;
        let validateTIdRs = Joi.string().regex(/^t\d+$/).required().validate(tId);
        let validateOIdRs = Joi.number().positive().required().validate(oId);
        if(validateOIdRs.error || validateTIdRs.error) {
            console.log(validateOIdRs.error);
            console.log(validateTIdRs.error);
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

    // chuyển đến tay người dùng
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

    // xác nhận đơn chuyển đến tay khách thành công
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

    // lấy đường đi ban đầu
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

    // lấy đường đi cuối
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
    };

    // lấy đơn có id lớn nhất
    getMaxOrderID = async() => {
        try {
            const maxOID = await Order.max("order_id");
            return maxOID;
        } catch (error) {
            console.log(error);
        }
    }

    // tạo ra đơn hàng
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
                order_status: orderData.create_unit,
                steps: 0,
            })
            .then(async () => {
                const newOrderId = await this.getMaxOrderID();
                res.json({
                    returnMessage: "Tạo thành công 1 đơn hàng",
                    orderId: newOrderId,
                });
            })
            .catch(error => {
                res.json({
                    returnMessage: "Lỗi khi tạo đơn hàng" + error.message,
                    orderId: '',
                });
            });
            const newOID = await this.getMaxOrderID();
            // console.log(newOID);
            await Delivery.create({
                order_id: newOID,
                from_id: "s",
                to_id: orderData.create_unit,
                date: orderData.date,
                deliver_status: 1
            })
        } catch (error) {
            console.log(error);
        };
    };

    // tạo đơn hàng khi cùng điểm giao dịch
    createOrderInTran = async(req, res) => {
        const orderData = req.body;
        let cPhone = orderData.customer_phone;
        let validateCPhoneRs = Joi.string().required().pattern(/^0\d+$/).length(10).validate(cPhone);
        let rPhone = orderData.receiver_phone;
        let validateRPhoneRs = Joi.string().required().pattern(/^0\d+$/).length(10).validate(rPhone);
        let date = orderData.date;
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
        else
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
                order_status: orderData.create_unit,
                steps: 6,
            })
            .then(async () => {
                const newOrderId = await this.getMaxOrderID();
                res.json({
                    returnMessage: "Tạo thành công 1 đơn hàng",
                    orderId: newOrderId,
                });
            })
            .catch(error => {
                res.json({
                    returnMessage: "Lỗi khi tạo đơn hàng" + error.message,
                    orderId: '',
                });
            });
            const newOID = await this.getMaxOrderID();
            // console.log(newOID);
            await Delivery.create({
                order_id: newOID,
                from_id: "s",
                to_id: orderData.create_unit,
                date: orderData.date,
                deliver_status: 1
            })
        } catch (error) {
            console.log(error);
        };
    }

    // lấy tất cả điểm tập kết
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

    // lấy tất cả điểm giao dịch thuộc điểm tập kết
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

    // lấy thông tin điểm giao dịch qua id
    getTransactionById = async (req, res) => {
        const data = req.query.transaction_id;
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            let transactions = [];
            transactions = await Transaction.findOne({
                where: {
                    trans_id: data,
                }
            });
            res.json(transactions);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    }

    // lấy thông tin đơn hàng qua id
    getOrderById = async (req, res) => {
        const data = req.query.order_id;
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            let order = [];
            order = await Order.findOne({
                where: {
                    order_id: data,
                }
            });
            if(order) {
                res.json({
                    message: 'Successful',
                    orderObject: order,
                });
            } else {
                res.json({
                    message: 'Order not found',
                    orderObject: '',
                })
            }
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    }

    // lấy thông tin của các vận chuyển của đơn hàng
    getAllDeliveryByOrderId = async (req, res) => {
        const data = req.query.order_id;
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            let delivery = [];
            delivery = await Delivery.findAll({
                where: {
                    order_id: data,
                },
            });
            res.json(delivery);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    }

    // lấy thônt itn điểm giao dịch
    getTransNameById = async (req, res) => {
        const data = req.query.trans_id;
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            let trans = [];
            trans = await Transaction.findOne({
                where: {
                    trans_id: data,
                },
            });
            res.json(trans);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    }

    // lấy thông tin điểm tập kết 
    getGatherNameById = async (req, res) => {
        const data = req.query.gather_id;
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            let gather = [];
            gather = await Gathering.findOne({
                where: {
                    gather_id: data,
                },
            });
            res.json(gather);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
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

    // xử lý khi khách hàng từ chối
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
};

module.exports = new transactionTellerController();
