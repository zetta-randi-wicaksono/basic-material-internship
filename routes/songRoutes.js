const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const authenticateToken = require('../middlewares/restAuth');

router.post('/:id', authenticateToken, songController.updateSong);

module.exports = router;
