const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cPassword: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.methods.generateToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, SECRET_KEY, {
      expiresIn: "2h",
    });
    return token;
  } catch (e) {
    console.log(e);
  }
};

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.cPassword = undefined;
  }
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
