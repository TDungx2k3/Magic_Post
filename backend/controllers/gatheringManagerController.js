const { sequelize } = require("../configdb/db");
const { QueryTypes } = require("sequelize");
const { Account } = require("../models/accountsModel");
const { Gathering } = require("../models/gatheringsModel");
const { Delivery } = require("../models/deliveriesModel");
const { Order } = require("../models/ordersModel");
const { raw } = require("mysql2");
const bcrypt = require('bcrypt');

// Gathering.belongsTo(Account, {
//     foreignKey: 'account_id',
// });
// Account.hasMany(Gathering, {
//     foreignKey: 'account_id',
// });

// Delivery.belongsTo(Order, {
//     foreignKey: 'order_id',
// })
// Order.hasMany(Delivery, {
//     foreignKey: 'order_id',
// })

// Delivery.hasMany(Gathering, {
//   foreignKey: ''
// })

class GatheringManagerController {
  createAccountEmployee = async (req, res) => {
    const data = await req.body;
    Account.create({
      account_id: data.accountId,
      account_name: data.accountName,
      account_phone: data.accountPhone,
      account_password: data.accountPassword,
      role_id: 6,
      unit: data.unit,
    });
  };

  showAllEmployee = async (req, res) => {
    const data = req.query;
    try {
      const allEmployee = await Account.findAll({
        where: {
          role_id: 6,
          unit: data.unit
        }
      });
      // return allEmployee;
      res.json(allEmployee);
    }
    catch (err) {
      console.log(err);
      res.send(err);
    }
  }

  // Chưa test
  deleteAccountEmployee = async (req, res) => {
    try {
      await Account.destroy({
        where: {
          account_id: req.body.account_id,
        }
      });
      res.send();
    } catch (error) {
      console.error(error);
    }
  }

  updateAccountEmployee = async (req, res) => {
    const data = req.body;

    try {
      const saltRounds = 10;
      const plaintextPassword = data.account_password;

      const hash = await bcrypt.hash(plaintextPassword, saltRounds);

      await Account.update({
        account_name: data.account_name,
        account_phone: data.account_phone,
        account_password: hash
      }, {
        where: {
          account_id: data.account_id,
        }
      });
      res.status(200).send('Account updated successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  };

  getDefaultAccountById = async (req, res) => {
    const data = req.query;
    try {
      const account = await Account.findAll({
        where: {
          account_id: data.account_id
        }
      });
      res.json(account)
    }
    catch (err) {
      console.error(err);
    }
  }

  showAllOrdersSent = async (req, res) => {
    const unit = req.query.unit;
    try {
      const allOrdersSent = await sequelize.query("SELECT `orders`.order_id, `orders`.weight, `orders`.price, `orders`.date, `orders`.customer_name, `orders`.customer_phone, `orders`.receiver_name, `orders`.receiver_phone FROM `orders` JOIN deliveries ON orders.order_id = deliveries.order_id JOIN gatherings ON deliveries.from_id = gatherings.gather_id WHERE deliveries.from_id = :unit AND deliveries.deliver_status = 1 ORDER BY orders.date DESC",
        {
          replacements: { unit: unit }
        }
      );
      res.json(allOrdersSent);
    }
    catch (err) {
      console.log(err);
      res.send(err);
    }
  }

  showAllOrdersReceived = async (req, res) => {
    const unit = req.query.unit;
    try {
      const allOrdersReceived = await sequelize.query("SELECT `orders`.order_id, `orders`.weight, `orders`.price, `orders`.date, `orders`.customer_name, `orders`.customer_phone, `orders`.receiver_name, `orders`.receiver_phone FROM `orders` JOIN deliveries ON orders.order_id = deliveries.order_id JOIN gatherings ON deliveries.to_id = gatherings.gather_id WHERE deliveries.to_id = :unit AND deliveries.deliver_status = 1 ORDER BY orders.date DESC",
        {
          replacements: { unit: unit }
        }
      );
      res.json(allOrdersReceived);
    }
    catch (err) {
      console.log(err);
      res.send(err);
    }
  }

  getMaxDateSent = async (req, res) => {
    const unit = req.query.unit;
    try {
      const result = await sequelize.query("SELECT MAX(orders.date) FROM orders JOIN deliveries ON orders.order_id = deliveries.order_id JOIN gatherings ON deliveries.from_id = gatherings.gather_id WHERE gatherings.gather_id = :unit",
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
      const result = await sequelize.query("SELECT MAX(orders.date) FROM orders JOIN deliveries ON orders.order_id = deliveries.order_id JOIN gatherings ON deliveries.to_id = gatherings.gather_id WHERE gatherings.gather_id = :unit",
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
                JOIN gatherings ON gatherings.gather_id = deliveries.from_id
                WHERE orders.date = :date AND gatherings.gather_id = :unit
            ) AS subquery`,
        {
          replacements: {
            date: date,
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
                JOIN gatherings ON gatherings.gather_id = deliveries.to_id
                WHERE orders.date = :date AND gatherings.gather_id = :unit
            ) AS subquery`,
        {
          replacements: {
            date: date,
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

  getCustomerDenyList = async (req, res) => {
    try {
      const unit = req.query.unit;

      const denyList = await sequelize.query("SELECT `orders`.order_id, `orders`.weight, `orders`.price, `orders`.date, `orders`.customer_name, `orders`.customer_phone, `orders`.receiver_name, `orders`.receiver_phone FROM `orders` JOIN deliveries ON orders.order_id = deliveries.order_id JOIN gatherings ON deliveries.from_id = gatherings.gather_id WHERE deliveries.from_id = :unit AND deliveries.to_id = :r AND deliveries.deliver_status = -1 ORDER BY orders.date DESC",
        {
          replacements: { 
            unit: unit,
            r: "r"
           }
        });
      res.json(denyList);
    }
    catch (err) {
      res.json(err);
    }
  }

  getLostOrderList = async (req, res) => {
    try {
      const unit = req.query.unit;

      const lostOrderList = await sequelize.query("SELECT `orders`.order_id, `orders`.weight, `orders`.price, `orders`.date, `orders`.customer_name, `orders`.customer_phone, `orders`.receiver_name, `orders`.receiver_phone FROM `orders` JOIN deliveries ON orders.order_id = deliveries.order_id JOIN gatherings ON deliveries.to_id = gatherings.gather_id WHERE deliveries.to_id = :unit AND deliveries.deliver_status = -1 ORDER BY orders.date DESC",
        {
          replacements: { unit: unit }
        });
      res.json(lostOrderList);
    }
    catch (err) {
      console.log(err);
      res.json(err);
    }
  }
}

module.exports = new GatheringManagerController();
