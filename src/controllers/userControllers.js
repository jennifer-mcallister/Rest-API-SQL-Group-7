const { userRoles } = require("../constants/users");
const { NotFoundError, UnauthorizedError } = require("../utils/errors");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  const [users, metadata] = await sequelize.query('SELECT user_id, email FROM user')
  return res.json(users);
};

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;

  const [user, metadata] = await sequelize.query(
    "SELECT user_id, email FROM user WHERE user_id = $userId",
    {
      bind: { userId },
      type: QueryTypes.SELECT,
    }
  );

  if (!user) throw new NotFoundError("That user does not exist");

  return res.json(user);
};

exports.deleteUserById = async (req, res) => {
  const userId = req.params.userId;

  if (userId != req.user?.userId && req.user.role !== userRoles.ADMIN) {
    throw new UnauthorizedError("Unauthorized Access");
  }
  await sequelize.query("DELETE FROM review WHERE fk_user_id = $userId", {
    bind: { userId },
  });

  const [results, metadata] = await sequelize.query(
    "DELETE FROM user WHERE user_id = $userId RETURNING *",
    {
      bind: { userId },
    }
  );

  if (!results || !results[0])
    throw new NotFoundError("That user does not exist");

  return res.sendStatus(204);
};
