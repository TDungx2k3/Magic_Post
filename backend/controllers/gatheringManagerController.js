const { sequelize } = require("../configdb/db");
const { QueryTypes } = require("sequelize");
const { Account } = require("../models/accountsModel");
const { Gathering } = require("../models/gatheringsModel");
const { Delivery } = require("../models/deliveriesModel");
const { Order } = require("../models/ordersModel");
const { raw } = require("mysql2");

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
    catch(err) {
      console.log(err);
      res.send(err);
    }
  }

  // Chưa test
  deleteAccountEmployee = async (req, res) => {
    try {
      const data = req.body;
      Account.destroy({
        where: {account_id: data.accountId}
      })
    }
    catch(err) {
      console.log(err);
      res.send(err);
    }
  }

  showAllOrdersSent = async (req, res) => {
    try {

    }
    catch(err) {
      console.log(err);
      res.send(err);
    }
  }

  test = async (req, res) => {
    const data = await sequelize.query(
      "SELECT * FROM accounts INNER JOIN gatherings ON accounts.account_id = gatherings.account_id",
      {raw: true,}
    );
    // const data = await sequelize.query('SELECT orders.order_id FROM orders INNER JOIN deliveries ON orders.order_id = deliveries.order_id');
    console.log(data[0]);
  };
}

module.exports = new GatheringManagerController();
