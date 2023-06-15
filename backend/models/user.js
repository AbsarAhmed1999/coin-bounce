const mongoose = require("mongoose");

const { Schema } = mongoose;
const userSchema = Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
                            //NameofModel           DatabaseConnection
module.exports = mongoose.model("User", userSchema, "users");
