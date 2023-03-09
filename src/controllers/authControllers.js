const { UnauthenticatedError } = require("../utils/errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { query } = require("express-validator");

exports.register = async (req, res) => {

  const { password, email, user } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);
  const [results, metadata] = await sequelize.query(
    "SELECT * FROM user LIMIT 1"
  );

  if (!results || results.length < 1) {

    await sequelize.query(
      `INSERT INTO user (email, password, fk_role_id, name) VALUES ($email, $password, '1', $user);`,
      {
        bind: {
          password: hashedpassword,
          email: email,
          user: user
        },
        type: QueryTypes.INSERT,
      }
    )
  } else {

    await sequelize.query(
      'INSERT INTO user (email, password, name, fk_role_id) VALUES ($email, $password, $user, (SELECT role_id FROM role WHERE role = "USER"))',
      {
        bind: {
          password: hashedpassword,
          email: email,
          user: user
        },
        type: QueryTypes.INSERT,
      }
    )
  }

  return res.status(201).json({
    message: "Registration succeeded. Please log in.",
  });
};

exports.login = async (req, res) => {

  const { email, password: canditatePassword } = req.body;

  const [user] = await sequelize.query(
    `
  SELECT user.email, user.password, role.role_id, role.role AS role, user.name
  FROM user
  LEFT JOIN role ON user.fk_role_id  = role.role_id
  WHERE user.email = $email
  LIMIT 1
  `,
    {
      bind: { email },
      type: QueryTypes.SELECT
    }
  )

  console.log(user);

  if (!user) throw new UnauthenticatedError("Invalid Credentials");


  const isPasswordCorrect = await bcrypt.compare(
    canditatePassword,
    user.password
  );
  if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Credentials");

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  };

  const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.json({ token: jwtToken, user: jwtPayload });
};
