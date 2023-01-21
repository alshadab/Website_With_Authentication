const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connect = require("./Conncection/connection");
dotenv.config();
const PORT = process.env.PORT || 5000;

const Auth = require("./Router/Auth");

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: process.env.OriginPath, credentials: true }));

//APi
app.use("/api/auth", Auth);

//Connection
app.listen(PORT, (req, res) => {
  console.log(`Listening on ${PORT}`);
  connect();
});
