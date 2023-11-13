const { DataTypes } = require("sequelize");
const { sequelize } = require("../configdb/db");

const Transaction = sequelize.define(
    "transactions",
    {
        trans_id: {
            type: DataTypes.STRING(5),
            allowNull: false,
            primaryKey: true,
        },
        trans_name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        account_id: {
            type: DataTypes.INTEGER(11),
            references: { model: 'accounts', key: 'account_id' },
        },
        gather_id: {
            type: DataTypes.STRING(5),
            references: { model: 'gatherings', key: 'gather_id' },
        }
    },
    {
        timestamps: false,
    }
);

Transaction.sync({ force: false }).then(() => {
    console.log("Transaction đã được đồng bộ hóa với cơ sở dữ liệu.");
});

module.exports = { Transaction };
