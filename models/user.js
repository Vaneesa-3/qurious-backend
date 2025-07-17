const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" } // ✅ added role field
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
