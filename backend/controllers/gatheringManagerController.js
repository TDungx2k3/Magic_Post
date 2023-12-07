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
    try {

    }
    catch (err) {
      console.log(err);
      res.send(err);
    }
  }

  test = async (req, res) => {
    const data = await sequelize.query(
      "SELECT * FROM accounts INNER JOIN gatherings ON accounts.account_id = gatherings.account_id",
      { raw: true, }
    );
    // const data = await sequelize.query('SELECT orders.order_id FROM orders INNER JOIN deliveries ON orders.order_id = deliveries.order_id');
    console.log(data[0]);
  };
}

module.exports = new GatheringManagerController();
