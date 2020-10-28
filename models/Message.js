const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  message: String,
  name: String,
  timestamp: String,
  received: Boolean
});

// collection
module.exports = mongoose.model("message", MessageSchema);
