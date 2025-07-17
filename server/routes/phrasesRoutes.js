const express = require('express');
const router = express.Router();
const phrasesController = require('../controllers/phrasesController');

router.get('/', phrasesController.getPhrases);
router.post('/', phrasesController.addPhrase);
router.put('/:id', phrasesController.updatePhrase);

module.exports = router;