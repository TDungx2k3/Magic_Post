const bcrypt = require('bcrypt');
const { sequelize } = require('../configdb/db');
const { Account } = require('../models/accountsModel');
const { Transaction } = require('../models/transactionsModel');
const { Gathering } = require('../models/gatheringsModel');
const Joi = require('joi');


class AccountController {
  showAllAccounts = async (req, res) => {
    try {
      // Wait for the synchronization process to finish
      await sequelize.authenticate();
      await sequelize.sync();
      const accounts = await Account.findAll();
      // return accounts;
      res.json(accounts);
    } catch (error) {
      console.error('Không thể lấy danh sách tài khoản:', error);
      //res.send(error);
    }
  }

  showAccountByPhoneAndPassword = async (req, res) => {
    const data = req.body;
    const phone = req.body.phone;
    let validateAPhoneRs = Joi.string().required().pattern(/^0\d+$/).length(10).validate(phone);
    if(validateAPhoneRs.error) {
      console.log(validateAPhoneRs.error);
    }
    else
    try {
      
      await sequelize.authenticate();
      await sequelize.sync();

      const accounts = await Account.findOne({
        where: {
          account_phone: phone,
        },
      });

      if(accounts) {
        bcrypt.compare(data.password, accounts.account_password, (err, result) => {
          if (err) {
            console.error('Error comparing passwords:', err);
          } else if (result) {
            console.log("OK");
            res.json({
              accounts,
              message: 'Login successfully',
            });
          } else {
            res.json({
              message: 'Phone/Password do not match',
            })
          }
        });

      } else {
        res.json({
          message: 'Phone/Password do not match',
        })
      }
    } catch (error) {
      console.error(error);
    }
  }

  async countAccountByPhoneNumber(req, res) {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      const data = req.query;
      const quantityAccountByPhoneNumber = await Account.count({
        where: { account_phone: data.phone },
      });
  
      if (quantityAccountByPhoneNumber > 0) {
        res.json({
          message: "Phone number exists",
          quantityAccountByPhoneNumber,
        });
      } else {
        res.json({
          message: "Phone number does not exist",
          quantityAccountByPhoneNumber,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  deleteAllAccountInTransaction = async(req, res) => {
    let unit = req.body.unit;
    let validateUnitRs = Joi.string().regex(/^[gt]\d+$/).required().validate(unit);
    if(validateUnitRs.error) {
      console.log(validateUnitRs.error);
    }
    else
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      // console.log(111);
      // console.log(req.body);
      await Account.destroy(
        {
          where: {
            unit: unit,
          }
        }
      );
      res.send();
    } catch(error) {
      console.log(error);
    }
  };

  deleteTransaction = async(req, res) => {
    let tId = req.body.trans_id;
    let validateTIdRs = Joi.string().regex(/^t\d+$/).required().validate(tId);
    if(validateTIdRs.error) {
      console.log(validateTIdRs.error);
    }
    else
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      await Transaction.destroy(
        {
          where: {
            trans_id: req.body.trans_id,
          }
        }
      );
      res.send();
    } catch(error) {
      console.log(error);
    }
  };

  deleteGather = async(req, res) => {
    let gId = req.body.gather_id;
    let validateGIdRs = Joi.string().regex(/^g\d+$/).required().validate(gId);
    if(validateGIdRs.error) {
      console.log(validateGIdRs.error);
    }
    else
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      await Gathering.destroy(
        {
          where: {
            gather_id: gId,
          }
        }
      );
      res.send();
    } catch(error) {
      console.log(error);
    }
  };

  deleteAllAccountInGather = async(req, res) => {
    let unit = req.body.unit;
    let validateUnitRs = Joi.string().regex(/^[gt]\d+$/).required().validate(unit);
    if(validateUnitRs.error) {
      console.log(validateUnitRs.error);
    }
    else
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      console.log(111);
      console.log(req.body);
      await Account.destroy(
        {
          where: {
            unit: unit,
          }
        }
      );
      res.send();
    } catch(error) {
      console.log(error);
    }
  };

}

module.exports = new AccountController();
// Make the entry point asynchronous
// (async () => {
//   await fetchAccounts();
// })();