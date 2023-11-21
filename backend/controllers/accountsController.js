const bcrypt = require('bcrypt');
const { sequelize } = require('../configdb/db');
const { Account } = require('../models/accountsModel');


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
    try {
      //console.log(req);
      const data = req.body;
      // const data = req.params;

      await sequelize.authenticate();
      await sequelize.sync();
      // data.phone = '0000000000';
      // data.password = '$2b$10$3AEdMMUzqghpbv6XHUVwFOHPsauqSnCp3/yTFc0SEbAZOSpmiIkyW';
      const accounts = await Account.findOne({
        where: {
          account_phone: data.phone,
        },
      });
      //.then((accounts) => { return res.json(accounts) });
      // return accounts.toJSON();
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
<<<<<<< HEAD
      }
      
=======
      } else {
        res.json({
          message: 'Phone/Password do not match',
        })
      }

>>>>>>> 7d2d1336e3af9c8dbc72347301bcf55e903862dc
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
  }
}

module.exports = new AccountController();
// Make the entry point asynchronous
// (async () => {
//   await fetchAccounts();
// })();