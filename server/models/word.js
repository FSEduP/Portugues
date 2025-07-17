const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  portugues: String,
  español: String,
  nivel: Number,
});

module.exports = mongoose.model('Word', wordSchema);