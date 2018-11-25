let mongoose = require('mongoose');

const schema = new mongoose.Schema({
  ip: String,
  browser: String,
  original_token: String,
  current_token: String,
  ttl: { type : Date, default: Date.now },
});

module.exports = mongoose.model('session', schema);