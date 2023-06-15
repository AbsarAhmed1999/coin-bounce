// creating schema/model of token
const mongoose = require("mongoose");

const { Schema } = mongoose;

const refreshTokenSchema = Schema(
  {
    token: { type: String, required: true },
    // here in ref User is a model name
    // previously we have defined users which was not the model name
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("RefreshToken", refreshTokenSchema, "tokens");
