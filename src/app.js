require("dotenv").config();
require("express-async-errors");
const express = require("express");
const apiRoutes = require("./routes");
const { errorMiddleware } = require("./middleware/errorMiddleware");
const { notFoundMiddleware } = require("./middleware/notFoundMiddleware");
const { sequelize } = require("./database/config");
// Security imports
const cors = require("cors");
const xss = require("xss-clean");
// const mongoSanitize = require("express-mongo-sanitize");
const { rateLimit } = require("express-rate-limit");
const { default: helmet } = require("helmet");
// const path = require("path"); // behöver vi denna?

/* ----------- Create our Expres app ------------ */
const app = express();

/* ---------------------------------------------- */
/* ----------------- Middleware ----------------- */
/* ---------------------------------------------- */
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Processing ${req.method} request to ${req.path}`);
  next();
});

/* ---------------------------------------------- */
/* ------------ Security Middleware ------------- */
/* ---------------------------------------------- */
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "PUT", "PATCH", "DELETE", "POST"],
  }) // cors är vad som är tillåtet att göra på denna host med endast dessa metoder
);
app.use(xss());
// app.use(mongoSanitize());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuter
    max: 60,
  }) // xss paket är limit för hur många request man får göra under en viss tid för att förhindra att systemet crashar
);
app.use(
  helmet() // säkerhet för HTTP Headers i appen där känslig information (express) döljs för användarna
  //och säkerhet för tredjeparts information att laddas tex bilden i notfound.html
);

/* ---------------------------------------------- */
/* ------------------- Routes ------------------- */
/* ---------------------------------------------- */
app.use("/api/v1", apiRoutes);

app.use("/test/:param", (req, res) => {
  return res.json({
    body: req.body,
    queryStrings: req.query,
  });
});

/* ---------------------------------------------- */
/* --------------- Error Handling --------------- */
/* ---------------------------------------------- */
app.use(notFoundMiddleware);
app.use(errorMiddleware);

/* ---------------------------------------------- */
/* ---------------- Server Setup ---------------- */
/* ---------------------------------------------- */
const port = process.env.PORT || 5000;
const run = async () => {
  try {
    await sequelize.authenticate();

    app.listen(port, () => {
      console.log(
        `Server is listening on ${
          process.env.NODE_ENV === "development" ? "http://localhost:" : "port "
        }${port}`
      );
    });
  } catch (error) {
    console.error(error);
  }
};

run();
