const mongoose = require("mongoose");

const { Schema } = mongoose;
const commentSchema = Schema(
  {
    content: { type: String, required: true },
    // The ref passed must be of model name
    blog: { type: mongoose.SchemaTypes.ObjectId, ref: "Blog" },
    author: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Comment", commentSchema, "comments");
