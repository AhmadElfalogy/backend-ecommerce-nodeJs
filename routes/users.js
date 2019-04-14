const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../models/user");
const authenticationMiddleware = require("../middlewares/authentication");

router.post("/", async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send(user);
  } catch (err) {
    next(createError(400, err));
  }
});
router.post("/authenticate", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) throw new Error("missing params");
    const user = await User.findOne({ username });
    if (!user) throw new Error("authentication failed");
    const isMatch = await user.verifyPassword(password);
    if (!isMatch) throw new Error("authentication failed");
    const token = await user.generateToken();
    res.send({
      token,
      user
    });
  } catch (err) {
    next(createError(400, err.message));
  }
});

router.use(authenticationMiddleware);

router.get("/profile", (req, res) => {
  res.send(req.user);
});

module.exports = router;
