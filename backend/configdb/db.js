const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("magic_post", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// try {
//   sequelize.authenticate();
//   console.log("Connection has been established successfully.");
// } catch (error) {
//   console.error("Unable to connect to the database:", error);
// }

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

module.exports = { sequelize };
