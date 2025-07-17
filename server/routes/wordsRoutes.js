const express = require('express');
const router = express.Router();
const wordsController = require('../controllers/wordsController');

router.get('/', wordsController.getWords);
router.post('/', wordsController.addWord);
router.put('/:id', wordsController.updateWord);

module.exports = router;