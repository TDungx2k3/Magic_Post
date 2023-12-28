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
  // tạo tài khoản nhân viên
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

  // lấy thông tin tất cả hân viên của đơn vị
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

  // Xóa tài khoản
  deleteAccountEmployee = async (req, res) => {
    let aId = req.body.account_id;
    let validateAIdRs = Joi.string().required().pattern(/^\d+$/).validate(aId);
    if(validateAIdRs.error) {
      console.log(validateAIdRs.error);
    }
    else
    try {
      await Account.destroy({
        where: {
          account_id: aId,
        }
      });
      res.send();
    } catch (error) {
      console.error(error);
    }
  }

  // cập nhật tài khoản
  updateAccountEmployee = async (req, res) => {
    const data = req.body;
    let aPhone = req.body.account_phone;
    let mPass = req.body.account_password;
    let validateAPassRs = Joi.string().required().min(6).max(30).validate(mPass)
    let validateAPhoneRs = Joi.string().required().pattern(/^0\d+$/).length(10).validate(aPhone);
    if(validateAPhoneRs.error || validateAPassRs.error) {
      console.log(validateAPhoneRs.error);
      console.log(validateAPassRs.error);
    }
    else 
    try {
      const saltRounds = 10;
      const plaintextPassword = mPass;

      const hash = await bcrypt.hash(plaintextPassword, saltRounds);

      await Account.update({
        account_name: data.account_name,
        account_phone: aPhone,
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

  // Lấy thông tin tài khoản theo id
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

  // lấy thông tin tất cả đơn hàng gửi đi
  showAllOrdersSent = async (req, res) => {
    const unit = req.query.unit;
    try {
      const allOrdersSent = await sequelize.query("SELECT `orders`.order_id, `orders`.weight, `orders`.price, `orders`.date, `orders`.customer_name, `orders`.customer_phone, `orders`.receiver_name, `orders`.receiver_phone FROM `orders` JOIN deliveries ON orders.order_id = deliveries.order_id JOIN gatherings ON deliveries.from_id = gatherings.gather_id WHERE deliveries.from_id = :unit ORDER BY orders.date DESC",
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

  // lấy thông tin tất cả đơn hàng nhận về
  showAllOrdersReceived = async (req, res) => {
    const unit = req.query.unit;
    try {
      const allOrdersReceived = await sequelize.query("SELECT `orders`.order_id, `orders`.weight, `orders`.price, `orders`.date, `orders`.customer_name, `orders`.customer_phone, `orders`.receiver_name, `orders`.receiver_phone FROM `orders` JOIN deliveries ON orders.order_id = deliveries.order_id JOIN gatherings ON deliveries.to_id = gatherings.gather_id WHERE deliveries.to_id = :unit ORDER BY orders.date DESC",
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

  // lấy ngày gửi gần nhất
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

  // lấy ngày nhận gần nhất
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

  // đếm số lương đơn hàng theo ngày
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

  // đếm số đơn nhận theo ngày của đơn vị
  countOrderReceivedInADate = async (req, res) => {
    try {
      const date = req.query.date;
      const unit = req.query.unit;
      console.log("unit  " + unit);

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

  // lấy danh sách tập khách hàng từ chối nhận
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

  // lấy tập đơn hàng bị mất
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

  // tạo tài khoản
  createAccount = async (req, res) => {
    let aPhone = req.body.accountPhone;
    let mPass = req.body.accountPassword;
    let validateAPassRs = Joi.string().required().min(6).max(30).validate(mPass)
    let validateAPhoneRs = Joi.string().required().pattern(/^0\d+$/).length(10).validate(aPhone);
    if(validateAPassRs.error || validateAPhoneRs.error) {
      console.log(validateAPassRs.error);
      console.log(validateAPhoneRs.error);

    }
    else
    try {
      const saltRounds = 10;
      const plaintextPassword = data.accountPassword;
      bcrypt.hash(plaintextPassword, saltRounds, (err, hash) => {
        if (err) {
          console.error('Error hashing password:', err);
        } else {
          data.accountPassword = hash;
        }
        Account.create({
          account_name: req.body.accountName,
          account_phone: aPhone,
          account_password: hash,
          role_id: 6,
          unit: data.unit,
        });
      });
      res.send();
    } catch (error) {
      console.log(error);
    }
    
  };
}

module.exports = new GatheringManagerController();
