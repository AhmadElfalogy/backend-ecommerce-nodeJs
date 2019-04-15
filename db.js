const mongoose = require("mongoose");
mongoose.connect(
  process.env.MONGO_URL || "mongodb://localhost:27017/ecommerce",
  {
    useNewUrlParser: true,
    autoIndex: true,
    useCreateIndex: true
  },
  err => {
    if (err) {
      console.error("Failed to connect");
      process.exit(1);
    } else console.log("Connected");
  }
);
