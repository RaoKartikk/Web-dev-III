const express = require('express');
const Note = require('../models/Note');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const appEvents = require('../events/appEvents');

const router = express.Router();

// POST /api/notes - Create a note
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.create({
      title,
      content,
      owner: req.user.id
    });

    appEvents.emit('note:created', { noteId: note._id, owner: req.user.id });
    return res.status(201).json(note);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating note', error: error.message });
  }
});

// GET /api/notes - Get all notes for logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.user.id });
    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
});

// PUT /api/notes/:id - Update own note
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    return res.status(200).json(note);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating note', error: error.message });
  }
});

// DELETE /api/notes/:id - Delete own note
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    return res.status(200).json({ message: 'Note deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting note', error: error.message });
  }
});

// file: /api/notes/admin/all - RBAC protected route (Admin only)
router.get('/admin/all', verifyToken, authorizeRoles('admin'), async (req, res) => {
   const allNotes = await Note.find().populate('owner', 'username email');
   return res.status(200).json(allNotes);
});
module.exports = router;