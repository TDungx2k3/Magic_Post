const { where } = require('sequelize');
const { sequelize } = require('../configdb/db');
const { Account } = require('../models/accountsModel');
const { Gathering } = require('../models/gatheringsModel');
const { Transaction } = require('../models/transactionsModel');
const { Role } = require("../models/rolesModel");
const bcrypt = require('bcrypt');

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

Role.hasOne(Account, {
    foreignKey: "role_id"
})
class LeaderController {
    showAllGathers = async (req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            let gathers = [];
            gathers = await Gathering.findAll(
                {
                    include: [
                        {
                            model: Account,
                        }
                    ]
                }
            );
            res.json(gathers);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };

    getGatherInfoWithID = async (req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            let gather = [];
            gather = await Gathering.findAll(
                {
                    include: {
                        model: Account,
                        attributes: [
                            "account_name",
                            "account_phone"
                        ]
                    },
                    where: {
                        gather_id: req.query.gather_id
                    },
                }
            );
            res.json(gather);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };

    updateGather = async (req, res) => {
        // console.log(req.body);
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            await Gathering.update(
                {
                    gather_name: req.body.gather_name,
                },
                {
                    where: {
                        gather_id: req.body.gather_id,
                    }
                }
            );
            res.send();
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };

    updateManager = async(req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            await Account.update(
                {
                    account_name: req.body.manager_name,
                    account_phone: req.body.manager_phone,
                },
                {
                    where: {
                        account_id: req.body.manager_id,
                    }
                }
            );
            res.send();
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    }

    updateManagerPassword = async(req, res) => {
        console.log(req.body);
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            const saltRounds = 10;
            const plaintextPassword = req.body.new_password;
            bcrypt.hash(plaintextPassword, saltRounds, async (err, hash) => {
                if (err) {
                    console.error('Error hashing password:', err);
                } else {
                    // console.log(11212);
                    await Account.update(
                        {
                            account_password: hash,
                        },
                        {
                            where: {
                                account_id: req.body.manager_id,
                            }
                        }
                    );
                }
            });
            res.send();
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };

    countPhoneNumber = async(req, res) => {
        // console.log(1111);
        // console.log(req);
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            const cnt = await Account.count(
                {
                    where: {
                        account_phone: req.query.account_phone,
                    }
                }
            );
            res.json(cnt);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    }

    getNewestAId = async(req, res) => {
        // console.log(1111);
        // console.log(req);
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            const newestId = await Account.max("account_id");
            res.json(newestId);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    }

    createGatherManager = async(req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            const saltRounds = 10;
            const plaintextPassword = "000000";
            bcrypt.hash(plaintextPassword, saltRounds, async (err, hash) => {
                if (err) {
                    console.error('Error hashing password:', err);
                } else {
                    // console.log(11212);
                    await Account.create(
                        {
                            account_name: req.body.manager_name,
                            account_phone: req.body.manager_phone,
                            account_password: hash,
                            role_id: 5
                        }
                    );
                }
            });
            res.send();
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };

    updateAccountInGather = async(req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            await Gathering.update(
                {
                    account_id: req.body.account_id,
                },
                {
                    where: {
                        gather_id: req.body.gather_id,
                    }
                }
            );
            res.send();
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };

    updateUnitInAccount = async(req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            await Account.update(
                {
                    unit: req.body.unit,
                },
                {
                    where: {
                        account_id: req.body.account_id,
                    }
                }
            );
            res.send();
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    }

    getMaxGatherId = async (req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync(); 
            const allGatherIds = await Gathering.findAll({
                attributes: ['gather_id'],
                raw: true, // Trả về kết quả dưới dạng mảng JSON đơn giản thay vì mô hình Sequelize
            });
            res.json("g" + (Math.max(...allGatherIds.map((obj) => parseInt(obj.gather_id.substring(1)))) + 1));
            // console.log(Math.max(...allGatherIds.map((obj) => parseInt(obj.gather_id.substring(1)))));
            return Math.max(...allGatherIds.map((obj) => parseInt(obj.gather_id.substring(1))));
        } catch (error) {
            console.error("Lỗi khi lấy gather_id lớn nhất:", error);
            throw error; // Hoặc xử lý lỗi theo cách bạn muốn ở đây.
        }
    };

    createGather = async (req, res) => {
        console.log("create gather");
        const data = req.body;
        await Gathering.create({
            gather_id: data.gather_id,
            gather_name: data.gather_name,
             account_id: data.account_id,
        });
        res.send();
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
            trans = await Transaction.findAll(
                {
                    where: {
                        gather_id: req.query.gather_id
                    },
                    include: [{
                        model: Account,
                        attributes: ['account_name',
                    'account_phone']
                    }]
                }
            );
            res.json(trans);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };

    getMaxTranId = async (req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync(); 
            const allTranIds = await Transaction.findAll({
                attributes: ['trans_id'],
                raw: true, // Trả về kết quả dưới dạng mảng JSON đơn giản thay vì mô hình Sequelize
            });
            res.json("t" + (Math.max(...allTranIds.map((obj) => parseInt(obj.trans_id.substring(1)))) + 1));
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

    getTransactionInfoWithID = async (req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            let trans = [];
            trans = await Transaction.findAll(
                {
                    include: {
                        model: Account,
                        attributes: [
                            "account_name",
                            "account_phone"
                        ]
                    },
                    where: {
                        trans_id: req.query.trans_id
                    },
                }
            );
            // console.log(trans);
            res.json(trans);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };

    updateTransaction = async (req, res) => {
        // console.log(req.body);
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            await Transaction.update(
                {
                    trans_name: req.body.trans_name,
                },
                {
                    where: {
                        trans_id: req.body.trans_id,
                    }
                }
            );
            res.send();
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };

    createTransaction = async (req, res) => {
        console.log("create trans");
        const data = req.body;
        await Transaction.create({
            trans_id: data.transaction_id,
            trans_name: data.transaction_name,
            account_id: data.account_id,
            gather_id: data.gather_id,
        });
        res.send();
    };

    createTransactionManager = async(req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            const saltRounds = 10;
            const plaintextPassword = "000000";
            bcrypt.hash(plaintextPassword, saltRounds, async (err, hash) => {
                if (err) {
                    console.error('Error hashing password:', err);
                } else {
                    // console.log(11212);
                    await Account.create(
                        {
                            account_name: req.body.manager_name,
                            account_phone: req.body.manager_phone,
                            account_password: hash,
                            role_id: 2,
                        }
                    );
                }
            });
            res.send();
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };

    updateAccountInTransaction = async(req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            await Transaction.update(
                {
                    account_id: req.body.account_id,
                },
                {
                    where: {
                        trans_id: req.body.transaction_id,
                    }
                }
            );
            res.send();
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };

    getEmployeesInUnit = async(req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            console.log(req.query);
            let employees = [];
            employees = await Role.findAll(
                {
                    include: {
                        model: Account,
                        where: {
                            unit: req.query.unit,
                        },
                    },
                    
                }
            );
            // console.log(trans);
            res.json(employees);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    }

}

module.exports = new LeaderController();