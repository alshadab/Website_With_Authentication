const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");
const User = require("../Model/UserRegSchema");

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.logtoken;
    const verifyToken = jwt.verify(token, SECRET_KEY);

    const MainUser = await User.findOne({ _id: verifyToken._id });
    const { name, email, _id, phone, address } = MainUser;
    if (!MainUser) {
      throw new Error("User not found");
    }
    req.token = token;
    req.MainUser = { name, email, _id, phone, address };
    req.userId = MainUser._id;

    next();
  } catch (err) {
    res.status(401).send("Unathorized");
  }
};

module.exports = authenticate;
