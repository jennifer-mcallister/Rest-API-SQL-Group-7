require("dotenv").config();
require("express-async-errors");
const express = require("express");
const apiRoutes = require("./routes");
const { errorMiddleware } = require("./middleware/errorMiddleware");
const { notFoundMiddleware } = require("./middleware/notFoundMiddleware");
const { sequelize } = require("./database/config");

const cors = require("cors");
const xss = require("xss-clean");
const { rateLimit } = require("express-rate-limit");
const { default: helmet } = require("helmet");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Processing ${req.method} request to ${req.path}`);
  next();
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "PUT", "PATCH", "DELETE", "POST"],
  })
);
app.use(xss());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(
  helmet()
);

app.use("/api/v1", apiRoutes);

app.use("/test/:param", (req, res) => {
  return res.json({
    body: req.body,
    queryStrings: req.query,
  });
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;
const run = async () => {
  try {
    await sequelize.authenticate();

    app.listen(port, () => {
      console.log(
        `Server is listening on http://localhost:${port}`
      );
    });
  } catch (error) {
    console.error(error);
  }
};

run();
