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

  date: {
    type: Date,
    default: Date.now(),
  },
  messages: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
});

//Instance Method For Generate Token
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
//Pre Methodsfor save password
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

//Instance Method For Storing Message
UserSchema.methods.addMessage = async function (name, email, phone, message) {
  try {
    this.messages = this.messages.concat({ name, email, phone, message });
    await this.save();
    return this.messages;
  } catch (e) {
    console.error(e);
  }
};
const User = mongoose.model("People", UserSchema);

module.exports = User;
