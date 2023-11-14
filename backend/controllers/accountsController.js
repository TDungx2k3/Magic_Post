const { sequelize } = require('../configdb/db');
const { Account } = require('../models/accountsModel');

class AccountController {
    showAllAccounts = async (req, res) => {
        try {
          // Wait for the synchronization process to finish
          await sequelize.authenticate();
          await sequelize.sync();
          const accounts = await Account.findAll();
          res.json(accounts);
        } catch (error) {
          console.error('Không thể lấy danh sách tài khoản:', error);
          res.send(error);
        }
    }

    showAccountByPhoneAndPassword = async (req, res) => {
      try {
        const data = req.body;
        await sequelize.authenticate();
        await sequelize.sync();
        data.phone = '0000000000';
        data.password = '$2b$10$3AEdMMUzqghpbv6XHUVwFOHPsauqSnCp3/yTFc0SEbAZOSpmiIkyW';
        const accounts = await Account.findOne({
          where: { 
            account_phone : '0000000000',
            // account_password : '$2b$10$3AEdMMUzqghpbv6XHUVwFOHPsauqSnCp3/yTFc0SEbAZOSpmiIkyW',
          },
        });
        return accounts;
      } catch (error) {
        console.error(error);
      }
    }
}

module.exports = new AccountController();
// Make the entry point asynchronous
// (async () => {
//   await fetchAccounts();
// })();