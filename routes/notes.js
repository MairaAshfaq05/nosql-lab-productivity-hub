// routes/notes.js
const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');
const { searchNotes } = require('../db/queries');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const ownerId = new ObjectId(req.session.user._id);
    const tagsParam = req.query.tags || '';
    const tags = tagsParam.split(',').map(s => s.trim()).filter(Boolean);
    const projectId = req.query.projectId ? new ObjectId(req.query.projectId) : undefined;

    let notes = [];
    if (tags.length > 0) {
      // QUERY 13
      notes = await searchNotes(getDb(), ownerId, tags, projectId);
    } else {
      notes = await getDb().collection('notes')
        .find({ ownerId }).sort({ createdAt: -1 }).toArray();
    }
    res.render('notes', { notes, tagsParam });
  } catch (err) { next(err); }
});

module.exports = router;
