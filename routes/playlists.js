const express = require('express');
const mongoose = require('mongoose'); // Import mongoose
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, description, songIds } = req.body;

  try {
    const playlist = new Playlist({
      name,
      description,
      songs: songIds,
    });

    await playlist.save();
    res.json(playlist);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, songIds } = req.body;

  console.log(`Updating playlist with ID: ${id}`); 

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'Invalid playlist ID' });
  }

  try {
    let playlist = await Playlist.findById(id);
    if (!playlist) {
      console.log('Playlist not found in the database'); // Debugging log
      return res.status(404).json({ msg: 'Playlist not found' });
    }

    playlist = await Playlist.findByIdAndUpdate(
      id,
      { $set: { name, description, songs: songIds } },
      { new: true }
    );

    res.json(playlist);
  } catch (err) {
    console.error('Error updating playlist:', err); // Debugging log
    res.status(500).send('Server error');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ msg: 'Playlist not found' });
    }
    await playlist.remove();
    res.json({ msg: 'Playlist removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
