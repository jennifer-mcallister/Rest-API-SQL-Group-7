const { userRoles } = require("../constants/users");
const { NotFoundError, UnauthorizedError } = require("../utils/errors");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  // prettier-ignore
  const [users, metadata] = await sequelize.query('SELECT user_id, email FROM user')
  return res.json(users);
};

exports.getUserById = async (req, res) => {
  // Grab the user id and place in local variable
  const userId = req.params.userId;

  // Get the user from the database (NOTE: excluding password)
  const [user, metadata] = await sequelize.query(
    "SELECT user_id, email FROM user WHERE user_id = $userId",
    {
      bind: { userId },
      type: QueryTypes.SELECT,
    }
  );

  // Not found error (ok since since route is authenticated)
  if (!user) throw new NotFoundError("That user does not exist");

  // Send back user info
  return res.json(user);
};

exports.updateUser = async (req, res) => {
  const userId = req.params.userId;

  let { username, password, email } = req.body;

  //ADMIN kan ändra alla konton, medans OWNER & USER kan endast ändra sina egna konto-uppgifter
  if (userId != req.user?.userId && req.user.role !== userRoles.ADMIN) {
    throw new UnauthorizedError("You can only update your own account");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  const [updatedUser, metadata] = await sequelize.query(
    `UPDATE user SET name = $username, password = $password, email = $email WHERE user_id = $userId RETURNING *;`,
    {
      bind: {
        userId: userId,
        username: username,
        password: hashedpassword,
        email: email,
      },
      type: QueryTypes.UPDATE,
    }
  );

  return res.sendStatus(201).send(updatedUser);
};

exports.deleteUserById = async (req, res) => {
  // Grab the user id and place in local variable
  const userId = req.params.userId;

  // Check if user is admin || user is requesting to delete themselves
  if (userId != req.user?.userId && req.user.role !== userRoles.ADMIN) {
    throw new UnauthorizedError("Unauthorized Access");
  }
  await sequelize.query("DELETE FROM review WHERE fk_user_id = $userId", {
    bind: { userId },
  });

  // Delete the user from the database
  const [results, metadata] = await sequelize.query(
    "DELETE FROM user WHERE user_id = $userId RETURNING *",
    {
      bind: { userId },
    }
  );

  // Not found error (ok since since route is authenticated)
  if (!results || !results[0])
    throw new NotFoundError("That user does not exist");

  // Send back user info
  return res.sendStatus(204);
};
