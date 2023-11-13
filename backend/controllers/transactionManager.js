const { sequelize } = require("../configdb/db");
const { Transaction } = require('../models/transactionsModel');
const { Account } = require("../models/accountsModel")

class TransactionManager {
    getMaxTransId = async () => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            const allTranIds = await Transaction.findAll({
                attributes: ['trans_id'],
                raw: true,
            });
            return Math.max(...allTranIds.map((obj) => parseInt(obj.trans_id.substring(1))));
        } catch (error) {
            console.error("Lỗi khi lấy trans_id lớn nhất:", error);
            throw error;
        }
    };

    createAccountEmployee = async (req, res) => {
        const data = req.body;
        Account.create({
            account_id_: data.accountId,
            account_name: data.accountName,
            account_phone: data.accountPhone,
            account_password: data.accountPassword,
            role_id: 4,
            unit: data.unit,
        });
    };
};

module.exports = new TransactionManager();
