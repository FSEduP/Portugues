const mongoose = require('mongoose');

const phraseSchema = new mongoose.Schema({
  portugues: String,
  español: String,
  nivel: Number,
});

module.exports = mongoose.model('Phrase', phraseSchema);