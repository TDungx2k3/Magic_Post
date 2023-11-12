const { DataTypes} = require("sequelize");
const { sequelize } = require("../configdb/db");

const Role = sequelize.define(
    "roles",
    {
        role_id: {
            type:DataTypes.INTEGER(10),
            primaryKey: true,
            autoIncrement:true
        },
        role_name: {
            type: DataTypes.STRING(50)
        },
        role_task: {
            type: DataTypes.STRING(200)
        }
    },
    {
        timestamps: false, // Unable timestamps
    }
);

Role.sync({ force: false }).then(() => {
    console.log("Role đã được đồng bộ hóa với cơ sở dữ liệu.");
  });
  
  module.exports = { Role };