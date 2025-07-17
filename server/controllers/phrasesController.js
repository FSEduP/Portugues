const Phrase = require('../models/phrase');

const getPhrases = async (req, res) => {
  const phrases = await Phrase.find();
  res.json(phrases);
};

const addPhrase = async (req, res) => {
  const { portugues, español, nivel } = req.body;
  const newPhrase = new Phrase({ portugues, español, nivel });
  await newPhrase.save();
  res.status(201).json(newPhrase);
};

const updatePhrase = async (req, res) => {
  const { id } = req.params;
  const { portugues, español, nivel } = req.body;
  try {
    const updatedPhrase = await Phrase.findByIdAndUpdate(id, { portugues, español, nivel }, { new: true });
    if (!updatedPhrase) {
      return res.status(404).json({ error: 'Frase no encontrada' });
    }
    res.json(updatedPhrase);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la frase' });
  }
};

module.exports = {
  getPhrases,
  addPhrase,
  updatePhrase
};