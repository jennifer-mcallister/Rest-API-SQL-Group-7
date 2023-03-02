const { UnauthenticatedError } = require("../utils/errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { userRoles } = require("../constants/users");

exports.register = async (req, res) => {
  // Place desired username, email and password into local variables
  const { password, email, user } = req.body;

  // Encrypt the desired password
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  // Check if there are users in the database
  const [results, metadata] = await sequelize.query(
    "SELECT user_id FROM user LIMIT 1"
  );

  // Add user to database (make admin if first user)
  // if (!results || results.length < 1) {
  //   // prettier-ignore
  //   await sequelize.query(
  // 		'INSERT INTO user (email, password, is_admin, name) VALUES ($email, $password, TRUE, $user, )',
  // 		{
  // 			bind: {
  // 				password: hashedpassword,
  // 				email: email,
  //         user: user
  // 			}
  // 		}
  // 	)
  // } else {
  // prettier-ignore
  await sequelize.query(
			'INSERT INTO user (email, password, name, fk_role_id) VALUES ($email, $password, $user, (SELECT role_id FROM role WHERE role = "USER"))', 
			{
				bind: {
					password: hashedpassword,
					email: email,
          user: user
				},
			}
		)
  // }

  // Request response
  return res.status(201).json({
    message: "Registration succeeded. Please log in.",
  });
};

exports.login = async (req, res) => {
  // Place candidate email and password into local variables
  const { email, password: canditatePassword } = req.body;

  // Check if user with that email exits in db
  // prettier-ignore
  const [user, metadata] = await sequelize.query(
		'SELECT * FROM user WHERE email = $email LIMIT 1;', {
		bind: { email },
		type: QueryTypes.SELECT
	})

  console.log(user);

  if (!user) throw new UnauthenticatedError("Invalid Credentials");

  // Check if password is correct
  // @ts-ignore
  const isPasswordCorrect = await bcrypt.compare(
    canditatePassword,
    user.password
  );
  if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Credentials");

  // Create JWT payload (aka JWT contents)
  const jwtPayload = {
    // @ts-ignore
    userId: user.id,
    // @ts-ignore
    email: user.email,
    role: user["is_admin"] === 1 ? userRoles.ADMIN : userRoles.USER,
  };

  // Create the JWT token
  const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: "1h" /* 1d */,
  });

  // Return the token
  return res.json({ token: jwtToken, user: jwtPayload });
};
