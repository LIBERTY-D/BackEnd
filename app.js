require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
// DATABASE
const DB = async (url) => {
  try {
    const connect = await mongoose.connect(url, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // autoIndex: true, //
      useFindAndModify: false,
    });
    console.log("DATABASE CONNECTED...");
  } catch (err) {
    console.log("The WAS AN ERROR WITH CONNECTING DATABASE", err);
  }
};
// SCHEMA
const user = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  message: {
    type: String,
  },
  Date: {
    type: Date,
  },
});
user.pre("save", function (next) {
  this.Date = Date.now();
  next();
});
const UserModel = mongoose.model("porfolio", user);
app.post("/emails", async (req, res, next) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(200).json({
      status: "Failed",
      message: "Your didnt Enter the Required Information",
    });
  }
  try {
    await UserModel.create(req.body);
    return res.status(200).json({
      status: "success",
      message: "Successfully sent",
    });
  } catch (err) {
    return err;
  }
});
app.get("/", (req, res, next) => {
  return res.status(200).send("welcome");
});
let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening to Port ${PORT}`);
});
DB(process.env.DB_STRING);
