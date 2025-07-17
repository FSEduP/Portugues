const Word = require('../models/word');

const getWords = async (req, res) => {
  const words = await Word.find();
  res.json(words);
};

const addWord = async (req, res) => {
  const { portugues, español, nivel } = req.body;
  const newWord = new Word({ portugues, español, nivel });
  await newWord.save();
  res.status(201).json(newWord);
};

const updateWord = async (req, res) => {
  const { id } = req.params;
  const { portugues, español, nivel } = req.body;
  try {
    const updatedWord = await Word.findByIdAndUpdate(id, { portugues, español, nivel }, { new: true });
    if (!updatedWord) {
      return res.status(404).json({ error: 'Palabra no encontrada' });
    }
    res.json(updatedWord);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la palabra' });
  }
};

module.exports = {
  getWords,
  addWord,
  updateWord
};