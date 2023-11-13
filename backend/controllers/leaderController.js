const { sequelize } = require('../configdb/db');
const { Account } = require('../models/accountsModel');
const { Gathering } = require('../models/gatheringsModel');
const { Transaction } = require('../models/transactionsModel');

Gathering.belongsTo(Account, {
    foreignKey: 'account_id',
});
Account.hasMany(Gathering, {
    foreignKey: 'account_id',
});

Transaction.belongsTo(Account, {
    foreignKey: 'account_id',
});
Account.hasMany(Transaction, {
    foreignKey: 'account_id',
});
class LeaderController {
    showAllGathers = async (req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            let gathers = [];
            gathers = await Gathering.findAll();
            res.json(gathers);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };

    getMaxGatherId = async () => {
        try {
            await sequelize.authenticate();
            await sequelize.sync(); 
            const allGatherIds = await Gathering.findAll({
                attributes: ['gather_id'],
                raw: true, // Trả về kết quả dưới dạng mảng JSON đơn giản thay vì mô hình Sequelize
            });
            // console.log(Math.max(...allGatherIds.map((obj) => parseInt(obj.gather_id.substring(1)))));
            return Math.max(...allGatherIds.map((obj) => parseInt(obj.gather_id.substring(1))));
        } catch (error) {
            console.error("Lỗi khi lấy gather_id lớn nhất:", error);
            throw error; // Hoặc xử lý lỗi theo cách bạn muốn ở đây.
        }
    };

    createGather = async (req, res) => {
        const data = req.body;
        Gathering.create({
            gather_id: "g" + (this.getMaxGatherId() + 1),
            gather_name: data.gatherName,
            account_id: data.accountId,
        })
    };

    showAllGatherManagers = async (req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            let gatherManagers = [];
            gatherManagers = await Gathering.findAll({
                include: [
                    {
                        model: Account,
                        attributes: ["account_id", 
                        "account_name",
                        "account_phone"],
                    }
                ]
            });
            console.log(gatherManagers);
            res.json(gatherManagers);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };

    showAllTrans = async (req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            let trans = [];
            trans = await Transaction.findAll();
            res.json(trans);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };

    getMaxTranId = async () => {
        try {
            await sequelize.authenticate();
            await sequelize.sync(); 
            const allTranIds = await Transaction.findAll({
                attributes: ['trans_id'],
                raw: true, // Trả về kết quả dưới dạng mảng JSON đơn giản thay vì mô hình Sequelize
            });
            return Math.max(...allTranIds.map((obj) => parseInt(obj.trans_id.substring(1))));
        } catch (error) {
            console.error("Lỗi khi lấy trans_id lớn nhất:", error);
            throw error; // Hoặc xử lý lỗi theo cách bạn muốn ở đây.
        }
    };

    createTran = async (req, res) => {
        const data = req.body;
        let temp;
        temp = await this.getMaxTranId();
        Transaction.create({
            trans_id: "t" + (temp + 1),
            trans_name: data.tranName,
            account_id: data.accountId,
            gather_id: data.gatherId,
        });
    };

    showAllTranManagers = async (req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            let tranManagers = [];
            tranManagers = await Transaction.findAll({
                include: [
                    {
                        model: Account,
                        attributes: ["account_id", 
                        "account_name",
                        "account_phone"],
                    }
                ]
            });
            console.log(gatherManagers);
            res.json(gatherManagers);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };
}

module.exports = new LeaderController();