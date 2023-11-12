const { DataTypes } = require("sequelize");
const { sequelize } = require("../configdb/db");

const Gathering = sequelize.define(
    "gatherings",
    {
        gather_id: {
            type: DataTypes.STRING(5),
            allowNull: false,
            primaryKey: true,
        },
        gather_name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        account_id: {
            type: DataTypes.INTEGER,
            references: { 
                model: 'accounts', 
                key: 'account_id' 
            },
        }
    },
    {
        timestamps: false, // Unable timestamps
    }
);

Gathering.sync({ force: false }).then(() => {
    console.log("Gathering đã được đồng bộ hóa với cơ sở dữ liệu.");
    });
    
    module.exports = { Gathering };