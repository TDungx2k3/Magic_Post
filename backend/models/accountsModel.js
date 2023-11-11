const { DataTypes} = require("sequelize");
const { sequelize } = require("../configdb/db");

const Account = sequelize.define(
  "accounts",
  {
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    account_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    account_phone: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    account_password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
  },
  {
    timestamps: false, // Enable timestamps
  }
);

Account.sync({ force: false }).then(() => {
  console.log("Mô hình đã được đồng bộ hóa với cơ sở dữ liệu.");
});

module.exports = { Account };