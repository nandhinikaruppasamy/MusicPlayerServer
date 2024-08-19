const express = require('express');
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation
const Song = require('../models/Song');

const router = express.Router();

router.post('/', async (req, res) => {
  const { title, artist, album, duration, url } = req.body;

  try {
    const song = new Song({ title, artist, album, duration, url });
    await song.save();
    res.status(201).json(song);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // Validate the ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'Invalid song ID' });
  }

  try {
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ msg: 'Song not found' });
    }
    await song.remove();
    res.json({ msg: 'Song removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
