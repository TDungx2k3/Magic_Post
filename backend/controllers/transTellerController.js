const { sequelize , Op } = require("../configdb/db");
const { Transaction } = require('../models/transactionsModel');
const { Account } = require("../models/accountsModel");
const { Order } = require("../models/ordersModel");
const { Delivery } = require("../models/deliveriesModel");
const bcrypt = require('bcrypt');
const Joi = require('joi');

Order.hasMany(Delivery, {
    foreignKey: 'order_id'
})
Delivery.belongsTo(Order, {
    foreignKey: "order_id"
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
};

module.exports = new transactionTellerController();
