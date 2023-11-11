const { sequelize } = require('../configdb/db');
const { Account } = require('../models/accountsModel');

class AccountController {
    showAllAccounts = async (req, res) =>{
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
}

module.exports = new AccountController();
// Make the entry point asynchronous
// (async () => {
//   await fetchAccounts();
// })();