const { where } = require('sequelize');
const { sequelize } = require('../configdb/db');
const { Account } = require('../models/accountsModel');
const { Gathering } = require('../models/gatheringsModel');
const { Transaction } = require('../models/transactionsModel');
const { Role } = require("../models/rolesModel");
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { Order } = require('../models/ordersModel');

// Gathering.belongsTo(Account, {
//     foreignKey: 'account_id',
// });
// Account.hasMany(Gathering, {
//     foreignKey: 'account_id',
// });

// Transaction.hasMany(Account, {
//     foreignKey: 'account_id',
// });
// Account.belongsTo(Transaction, {
//     foreignKey: 'account_id',
// });

// Role.belongsTo(Account, {
//     foreignKey: 'role_id',
// });
// Account.hasMany(Role, {
//     foreignKey: 'role_id',
// });
class LeaderController {
    // chuẩn hóa tên điểm tập kết
    gatherNameNormalize = (name) => {
        
        const tenChuanHoa = name.replace(/\s+/g, " ").trim();
        
        return tenChuanHoa.charAt(0).toUpperCase() + tenChuanHoa.slice(1);
    };

    // chuẩn hóa tên người
    managerNameNormalize = (name) => {
        // Chia tách tên thành các từ
        name = name.replace(/\s+/g, " ").trim();
        const words = name.split(" ");

        // Chuẩn hóa từng từ
        const capitalizeWords = words.map((word) => {
            // Loại bỏ dấu và viết hoa chữ cái đầu tiên của từ
            const tuChuanHoa = word.replace(/[\u0300-\u036f\s]/g, "");
            return tuChuanHoa.charAt(0).toUpperCase() + tuChuanHoa.slice(1);
        });

        // Kết hợp các từ đã chuẩn hóa để tạo tên mới
        const rs = capitalizeWords.join(" ");

        return rs;
    };

    // lấy tất cả dữ liệu về các điểm tập kết
    showAllGathers = async (req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            let gathers = [];
            gathers = await sequelize.query(
                "SELECT * FROM `gatherings` JOIN `accounts` ON `gatherings`.account_id = `accounts`.account_id",
                {
                    raw: true,
                    type: sequelize.QueryTypes.SELECT,
                }
            );
            res.json(gathers);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };

    // lấy thông tin điểm tập kết với id
    getGatherInfoWithID = async (req, res) => {
        let validateRs = Joi.string().required().pattern(/g\d/).validate(req.query.gather_id);
        if(validateRs.error)
        {
            console.log(validateRs.error);
        }
        else {
            try {
                await sequelize.authenticate();
                await sequelize.sync();
                let gather = [];
                gather = await sequelize.query(
                    "SELECT * FROM `gatherings` JOIN `accounts` ON `gatherings`.account_id = `accounts`.account_id WHERE `gatherings`.gather_id = :gId",
                    {
                        raw: true,
                        type: sequelize.QueryTypes.SELECT,
                        replacements: {
                            gId: req.query.gather_id,
                        },
                    }
                );
                
                res.json(gather);
            } catch (error) {
                res.send(error);
                console.log(error);
            }
        }
        
    };

    // cập nhật điểm tập kết
    updateGather = async (req, res) => {
        let gName = req.body.gather_name;
        let gId = req.body.gather_id;
        let validateGNameRs = Joi.string().required().validate(gName);
        let validateGIdRs = Joi.string().regex(/^g\d+$/).required().validate(gId);
        if(validateGNameRs.error)
        {
            console.log(validateGNameRs.error);
        }
        else if (validateGIdRs.error) {
            console.log(validateGIdRs.error);
        }
        else {
            try {
                gName = this.gatherNameNormalize(gName);
                await sequelize.authenticate();
                await sequelize.sync();
                await Gathering.update(
                    {
                        gather_name: gName,
                    },
                    {
                        where: {
                            gather_id: gId,
                        }
                    }
                );
                res.send();
            } catch (error) {
                res.send(error);
                console.log(error);
            }
        }
        // console.log(req.body);
        
    };

    // cập nhật trưởng điểm
    updateManager = async(req, res) => {
        let mPhone = req.body.manager_phone;
        let mName = req.body.manager_name;
        let mId = "" + req.body.manager_id;
        console.log(mId);
        let validateMPhoneRs = Joi.string().required().pattern(/^0\d+$/).length(10).validate(mPhone);
        let validateMNameRs = Joi.string().required().validate(mName);
        let validateMIdRs = Joi.string().required().pattern(/^\d+$/).validate(mId);
        if(validateMIdRs.error
        || validateMNameRs.error
        || validateMPhoneRs.error)
        {
            console.log(validateMIdRs.error);
            console.log(validateMNameRs.error);
            console.log(validateMPhoneRs.error);
        }
        else {
            try {
                mName = this.managerNameNormalize(mName);
                await sequelize.authenticate();
                await sequelize.sync();
                await Account.update(
                    {
                        account_name: mName,
                        account_phone: mPhone,
                    },
                    {
                        where: {
                            account_id: mId,
                        }
                    }
                );
                res.send();
            } catch (error) {
                res.send(error);
                console.log(error);
            }
        }
    };

    // cập nhật password
    updateManagerPassword = async(req, res) => {
        console.log(req.body);
        let mId = "" + req.body.manager_id;
        let mPass = req.body.new_password;
        let validateMIdRs = Joi.string().required().pattern(/^\d+$/).validate(mId);
        let validateMPassRs = Joi.string().required().min(6).max(30).validate(mPass)
        if(validateMIdRs.error || validateMPassRs.error) {
            console.log(validateMIdRs.error);
            console.log(validateMPassRs.error);
        }
        else {
            try {
                await sequelize.authenticate();
                await sequelize.sync();
                const saltRounds = 10;
                const plaintextPassword = mPass;
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
                                    account_id: mId,
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
        }
    };

    // đếm số điện thoại xuât hiện
    countPhoneNumber = async(req, res) => {
        let aPhone = req.query.account_phone;
        let validateAPhoneRs = Joi.string().required().pattern(/^0\d+$/).length(10).validate(aPhone);
        if(validateAPhoneRs.error) {
            console.log(validateAPhoneRs.error);
        }
        else {
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
    };

    // lấy id của acc mới được tạo
    getNewestAId = async(req, res) => {
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

    // tạo trưởng điểm tập kết mới
    createGatherManager = async(req, res) => {
        let mPhone = req.body.manager_phone;
        let mName = req.body.manager_name;
        let validateMPhoneRs = Joi.string().required().pattern(/^0\d+$/).length(10).validate(mPhone);
        let validateMNameRs = Joi.string().required().validate(mName);
        if(validateMNameRs.error
        || validateMPhoneRs.error)
        {
            console.log(validateMIdRs.error);
            console.log(validateMNameRs.error);
            console.log(validateMPhoneRs.error);
        }
        else {
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
                                account_name: mName,
                                account_phone: mPhone,
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
        }
        
    };

    // cập nhật tài khaonr trong điểm tập kết
    updateAccountInGather = async(req, res) => {
        let gId = req.body.gather_id;
        let aId = req.body.account_id;
        let validateGIdRs = Joi.string().regex(/^g\d+$/).required().validate(gId);
        let validateAIdRs = Joi.string().required().pattern(/^\d+$/).validate(aId);
        if (validateGIdRs.error
        || validateAIdRs.error) {
            console.log(validateGIdRs.error);
            console.log(validateAIdRs.error);
        }
        else {
            try {
                await sequelize.authenticate();
                await sequelize.sync();
                await Gathering.update(
                    {
                        account_id: aId,
                    },
                    {
                        where: {
                            gather_id: gId,
                        }
                    }
                );
                res.send();
            } catch (error) {
                res.send(error);
                console.log(error);
            }
        }
    };

    // cập nhật nơi làm việc của nhân viên
    updateUnitInAccount = async(req, res) => {
        let unit = req.body.unit;
        let aId = req.body.account_id;
        let validateUnitRs = Joi.string().regex(/^[gt]\d+$/).required().validate(unit);
        let validateAIdRs = Joi.string().required().pattern(/^\d+$/).validate(aId);
        if(validateAIdRs.error
        || validateUnitRs.error) {
            console.log(validateAIdRs.error);
            console.log(validateUnitRs.error);
        } 
        else {
            try {
                await sequelize.authenticate();
                await sequelize.sync();
                await Account.update(
                    {
                        unit: unit,
                    },
                    {
                        where: {
                            account_id: aId,
                        }
                    }
                );
                res.send();
            } catch (error) {
                res.send(error);
                console.log(error);
            }
        }
    };

    // lấy gather mới nhất
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

    // tạo điểm tập kết mới
    createGather = async (req, res) => {
        // console.log("create gather");
        let gId = req.body.gather_id;
        let gName = req.body.gather_name;
        let aId = req.body.account_id;
        let validateGIdRs = Joi.string().regex(/^g\d+$/).required().validate(gId);
        let validateGNameRs = Joi.string().required().validate(gName);
        let validateAIdRs = Joi.string().required().pattern(/^\d+$/).validate(aId);
        if(validateAIdRs.error
        || validateGNameRs.error
        || validateGIdRs.error) {
            console.log(validateAIdRs.error);
            console.log(validateGNameRs.error);
            console.log(validateGIdRs.error);
        } 
        else {
            gName = this.gatherNameNormalize(gName);
            await Gathering.create({
                gather_id: gId,
                gather_name: gName,
                 account_id: aId,
            });
            res.send();
        }
        
    };

    // lấy tất cả trưởng điểm tập kết
    showAllGatherManagers = async (req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            let gatherManagers = [];
            gatherManagers = await sequelize.query(
                "SELECT * FROM `gatherings` JOIN `accounts` ON `gatherings`.account_id = `accounts`.account_id",
                {
                    raw: true,
                    type: sequelize.QueryTypes.SELECT,
                }
            );
            console.log(gatherManagers);
            res.json(gatherManagers);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };

    // lấy tất cả điểm giao dịch với gather_id
    showAllTrans = async (req, res) => {
        let gId = req.query.gather_id;
        let validateGIdRs = Joi.string().regex(/^g\d+$/).required().validate(gId);
        if(validateGIdRs.error) {
            console.log(validateGIdRs.error);
        }
        else {
            try {
                console.log(123);
                await sequelize.authenticate();
                await sequelize.sync();
                let trans = [];
                trans = await sequelize.query(
                    "SELECT * FROM `transactions` JOIN `accounts` ON `transactions`.account_id = `accounts`.account_id WHERE `transactions`.gather_id = :gId",
                    {
                        raw: true,
                        type: sequelize.QueryTypes.SELECT,
                        replacements: {
                            gId: gId,
                        },
                    }
                );
                res.json(trans);
            } catch (error) {
                res.send(error);
                console.log(error);
            }
        }
        
    };

    // lấy id của điểm giao dịch mới tạo
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

    // tạo ra điểm giao dịch mới
    createTran = async (req, res) => {
        let temp;
        temp = await this.getMaxTranId();
        let gId = req.body.gatherId;
        let aId = req.body.account_id;
        let tName = req.body.tranName;
        let validateAIdRs = Joi.string().required().pattern(/^\d+$/).validate(aId);
        let validateTNameRs = Joi.string().required().validate(tName);
        let validateGIdRs = Joi.string().regex(/^g\d+$/).required().validate(gId);
        if(validateAIdRs.error
        || validateGIdRs.error
        || validateTNameRs.error) {
            tName = this.gatherNameNormalize(tName);
            Transaction.create({
                trans_id: "t" + (temp + 1),
                trans_name: tName,
                account_id: aId,
                gather_id: gId,
            });
        }
        
    };

    // lấy thông tin trưởng điểm giao dịch và điểm giao dịch
    showAllTranManagers = async (req, res) => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            let tranManagers = [];
            tranManagers = await sequelize.query(
                "SELECT * FROM `transactions` JOIN `accounts` ON `transactions`.account_id = `accounts`.account_id",
                {
                    raw: true,
                    type: sequelize.QueryTypes.SELECT,
                }
            );
            console.log(tranManagers);
            res.json(tranManagers);
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };

    // lấy thông tin điểm giao dịch với id
    getTransactionInfoWithID = async (req, res) => {
        let tId = req.query.trans_id;
        let validateTIdRs = Joi.string().regex(/^t\d+$/).required().validate(tId);
        if(validateTIdRs.error) {
            console.log(validateTIdRs.error);
        }
        else {
            try {
                await sequelize.authenticate();
                await sequelize.sync();
                let trans = [];
                trans = await sequelize.query(
                    "SELECT * FROM `transactions` JOIN `accounts` ON `transactions`.account_id = `accounts`.account_id WHERE `transactions`.trans_id = :tId",
                    {
                        raw: true,
                        type: sequelize.QueryTypes.SELECT,
                        replacements: {
                            tId: tId,
                        },
                    }
                );
                res.json(trans);
            } catch (error) {
                res.send(error);
                console.log(error);
            }
        }
        
    };

    // cập nhật điểm giao dịch
    updateTransaction = async (req, res) => {
        // console.log(req.body);
        let tId = req.body.trans_id;
        let tName = req.body.trans_name;
        let validateTIdRs = Joi.string().regex(/^t\d+$/).required().validate(tId);
        let validateTNameRs = Joi.string().required().validate(tName);
        if(validateTIdRs.error
        || validateTNameRs.error) {
            try {
                tName = this.gatherNameNormalize(tName);
                await sequelize.authenticate();
                await sequelize.sync();
                await Transaction.update(
                    {
                        trans_name: tName,
                    },
                    {
                        where: {
                            trans_id: tId,
                        }
                    }
                );
                res.send();
            } catch (error) {
                res.send(error);
                console.log(error);
            }
        }
        
    };

    // tạo ra điểm giao dịch mới
    createTransaction = async (req, res) => {
        let tId = req.body.transaction_id;
        let tName = req.body.transaction_name;
        let gId = req.body.gather_id;
        let aId = req.body.account_id;
        let validateTIdRs = Joi.string().regex(/^t\d+$/).required().validate(tId);
        let validateTNameRs = Joi.string().required().validate(tName);
        let validateAIdRs = Joi.string().required().pattern(/^\d+$/).validate(aId);
        let validateGIdRs = Joi.string().regex(/^g\d+$/).required().validate(gId);
        if(validateAIdRs.error
        || validateGIdRs.error
        || validateTIdRs.error
        || validateTNameRs.error) {
            console.log(validateAIdRs.error);
            console.log(validateGIdRs.error);
            console.log(validateTIdRs.error);
            console.log(validateTNameRs.error);
        }
        else {
            console.log("create trans");
            tName = this.gatherNameNormalize(tName);
            await Transaction.create({
                trans_id: tId,
                trans_name: tName,
                account_id: aId,
                gather_id: gId,
            });
            res.send();
        }
        
    };

    // tạo ra trưởng điểm giao dịch mới
    createTransactionManager = async(req, res) => {
        let mPhone = req.body.manager_phone;
        let mName = req.body.manager_name;
        let validateMPhoneRs = Joi.string().required().pattern(/^0\d+$/).length(10).validate(mPhone);
        let validateMNameRs = Joi.string().required().validate(mName);
        if(validateMNameRs.error
        || validateMPhoneRs.error) {
            console.log(validateMNameRs.error);
            console.log(validateMPhoneRs.error);
        }
        else {
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
                        mName = this.managerNameNormalize(mName);
                        await Account.create(
                            {
                                account_name: mName,
                                account_phone: mPhone,
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
        }
        
    };

    // cập nhật tài khoản trong điểm giao dịch
    updateAccountInTransaction = async(req, res) => {
        let aId = req.body.account_id;
        let tId = req.body.transaction_id;
        let validateAIdRs = Joi.string().required().pattern(/^\d+$/).validate(aId);
        let validateTIdRs = Joi.string().regex(/^t\d+$/).required().validate(tId);
        if(validateAIdRs.error || validateTIdRs.error) {
            console.log(validateAIdRs.error);
            console.log(validateTIdRs.error);
        }
        else {
            try {
                await sequelize.authenticate();
                await sequelize.sync();
                await Transaction.update(
                    {
                        account_id: aId,
                    },
                    {
                        where: {
                            trans_id: tId,
                        }
                    }
                );
                res.send();
            } catch (error) {
                res.send(error);
                console.log(error);
            }
        }
    };

    // lấy các nhân viên theo nơi đang làm
    getEmployeesInUnit = async(req, res) => {
        let unit = req.query.unit;
        let validateUnitRs = Joi.string().regex(/^[gt]\d+$/).required().validate(unit);
        if(validateUnitRs.error) {
            console.log(validateUnitRs.error);
        }
        else {
            try {
                await sequelize.authenticate();
                await sequelize.sync();
                console.log(req.query);
                let employees = [];
                employees = await sequelize.query(
                    "SELECT * FROM `roles` JOIN `accounts` ON `roles`.role_id = `accounts`.role_id WHERE `accounts`.unit = :unit",
                    {
                        raw: true,
                        type: sequelize.QueryTypes.SELECT,
                        replacements: {
                            unit: unit,
                        },
                    }
                );
                res.json(employees);
            } catch (error) {
                res.send(error);
                console.log(error);
            }
        }
    };

    // lấy tất cả nhữn đơn hàng đến theo ngày
    getToOrdersWithUnit = async(req, res) => {
        let unit = req.query.unit;
        let date = req.query.date;
        console.log(unit);
        console.log(date);
        let validateUnitRs = Joi.string().regex(/^[gt]\d+$/).required().validate(unit);
        let validateDateRs = Joi.date().required().validate(date);
        if(validateUnitRs.error || validateDateRs.error) {
            console.log(validateUnitRs.error);
            console.log(validateDateRs.error);
        }
        else {
            try {
                const allOrdersToUnit = await sequelize.query(
                    "SELECT * FROM `deliveries` JOIN `orders` ON `deliveries`.order_id = `orders`.order_id WHERE `deliveries`.date = :date AND `deliveries`.to_id = :unit",
                    {
                        raw: true,
                        type: sequelize.QueryTypes.SELECT,
                        replacements: {
                            date: date,
                            unit: unit,
                        },
                    }
                  );
                res.json(allOrdersToUnit);
            }
            catch(err) {
                console.log(err);
                res.send(err);
            }
        }
    };

    // lấy tất cả những đơn hàng đến điểm đó
    getFromOrdersWithUnit = async(req, res) => {
        let unit = req.query.unit;
        let date = req.query.date;
        console.log(unit);
        console.log(date);
        let validateUnitRs = Joi.string().regex(/^[gt]\d+$/).required().validate(unit);
        let validateDateRs = Joi.date().required().validate(date);
        if(validateUnitRs.error || validateDateRs.error) {
            console.log(validateUnitRs.error);
            console.log(validateDateRs.error);
        }
        else {
            try {
                const allOrdersToUnit = await sequelize.query(
                    "SELECT * FROM `deliveries` JOIN `orders` ON `deliveries`.order_id = `orders`.order_id WHERE `deliveries`.date = :date AND `deliveries`.from_id = :unit",
                    {
                        raw: true,
                        type: sequelize.QueryTypes.SELECT,
                        replacements: {
                            date: date,
                            unit: unit,
                        },
                    }
                  );
                res.json(allOrdersToUnit);
            }
            catch(err) {
                console.log(err);
                res.send(err);
            }
        }
    };

    // lấy ngày lớn nhất trong csdl
    getMaxDate = async (req, res) => {
        try {
            const maxDate = await Order.max('date');
            res.json(maxDate);
        }
        catch(err) {
            res.json(err);
        }
    };

    // đếm số lượng đơn hàng trong 1 ngày
    countOrdersInADate = async (req, res) => {
        try {
            const ordersInADate = await Order.count({
                where: {
                    date: req.query.date
                }
            });
            res.json(ordersInADate);
        }
        catch(err) {
            res.json(err);
        }
    };
}

module.exports = new LeaderController();