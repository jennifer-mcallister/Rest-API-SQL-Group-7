const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize("walkingTrailDb", "", "", {
  dialect: "sqlite",
  storage: path.join(__dirname, "walkingTrailDb.sqlite"),
});

module.exports = { sequelize };
