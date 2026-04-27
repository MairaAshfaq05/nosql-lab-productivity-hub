// routes/tasks.js
const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');
const {
  createTask, updateTaskStatus, addTaskTag, removeTaskTag,
  toggleSubtask, deleteTask
} = require('../db/queries');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.post('/', async (req, res, next) => {
  try {
    const ownerId = new ObjectId(req.session.user._id);
    const projectId = new ObjectId(req.body.projectId);
    const { title, priority, tags, subtasks } = req.body;
    // QUERY 7
    await createTask(getDb(), {
      ownerId,
      projectId,
      title,
      priority: parseInt(priority || '1', 10),
      tags: parseTags(tags),
      subtasks: parseSubtasks(subtasks)
    });
    res.redirect(`/projects/${req.body.projectId}`);
  } catch (err) { next(err); }
});

router.post('/:id/status', async (req, res, next) => {
  try {
    // QUERY 8
    await updateTaskStatus(getDb(), new ObjectId(req.params.id), req.body.status);
    res.redirect(req.get('Referrer') || '/dashboard');
  } catch (err) { next(err); }
});

router.post('/:id/tags/add', async (req, res, next) => {
  try {
    // QUERY 9
    await addTaskTag(getDb(), new ObjectId(req.params.id), req.body.tag);
    res.redirect(req.get('Referrer') || '/dashboard');
  } catch (err) { next(err); }
});

router.post('/:id/tags/remove', async (req, res, next) => {
  try {
    // QUERY 10
    await removeTaskTag(getDb(), new ObjectId(req.params.id), req.body.tag);
    res.redirect(req.get('Referrer') || '/dashboard');
  } catch (err) { next(err); }
});

router.post('/:id/subtask/toggle', async (req, res, next) => {
  try {
    // QUERY 11
    await toggleSubtask(
      getDb(),
      new ObjectId(req.params.id),
      req.body.subtaskTitle,
      req.body.done === 'true'
    );
    res.redirect(req.get('Referrer') || '/dashboard');
  } catch (err) { next(err); }
});

router.post('/:id/delete', async (req, res, next) => {
  try {
    // QUERY 12
    await deleteTask(getDb(), new ObjectId(req.params.id));
    res.redirect(req.get('Referrer') || '/dashboard');
  } catch (err) { next(err); }
});

function parseTags(raw) {
  if (!raw) return [];
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}
function parseSubtasks(raw) {
  if (!raw) return [];
  return raw.split('\n').map(s => s.trim()).filter(Boolean)
    .map(title => ({ title, done: false }));
}

module.exports = router;
