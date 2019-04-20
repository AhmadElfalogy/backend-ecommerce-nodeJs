const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
const secretKey = process.env.SECRET_KEY || "My-Secret-Key";
const tokenExpiry = process.env.TOKEN_EXPIRY || "5m";

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      index: {
        unique: true
      },
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      validate: validator.isEmail
    }
  },

  {
    collection: "users",
    toJSON: {
      hidden: ["password", "__v"],
      transform: true
    }
  }
);

schema.options.toJSON.transform = function (doc, ret, options) {
  if (Array.isArray(options.hidden)) {
      options.hidden.forEach(field => {
          delete ret[field];
      });
  }
  return ret;
};


schema.method('verifyPassword', function (comparedPassword) {
  const user = this;
  return bcrypt.compare(comparedPassword, user.password);
});


schema.method('generateToken', function (comparedPassword) {
  const user = this;
  return sign({ _id: user._id }, secretKey, { expiresIn: tokenExpiry });
});


schema.static('getUserByToken', async function (token) {
  const decoded = await verify(token, secretKey);
  const user = await User.findById(decoded._id);
  if (!user) throw new Error('user not found');
  return user;
});

const hashPassword = (password) => bcrypt.hash(password, saltRounds)


schema.pre('save', async function () {
  console.log('before saving')
  const user = this;
  if (user.isNew || user.modifiedPaths().includes('password')) {
      user.password = await hashPassword(user.password);
  }
});


const User = mongoose.model('User', schema);

module.exports = User;