// routes/dashboard.js
const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');
const { projectTaskSummary, recentActivityFeed } = require('../db/queries');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const ownerId = new ObjectId(req.session.user._id);
    // QUERY 14
    const summary = await projectTaskSummary(getDb(), ownerId);
    // QUERY 15
    const activity = await recentActivityFeed(getDb(), ownerId);
    res.render('dashboard', { summary, activity });
  } catch (err) { next(err); }
});

module.exports = router;
