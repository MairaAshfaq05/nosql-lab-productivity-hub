// routes/projects.js
const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');
const { listUserProjects, createProject, archiveProject, listProjectTasks } = require('../db/queries');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const ownerId = new ObjectId(req.session.user._id);
    // QUERY 3
    const projects = await listUserProjects(getDb(), ownerId);
    res.render('projects', { projects, error: null });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.redirect('/projects');
    const ownerId = new ObjectId(req.session.user._id);
    // QUERY 4
    await createProject(getDb(), { ownerId, name, description: description || '' });
    res.redirect('/projects');
  } catch (err) { next(err); }
});

router.post('/:id/archive', async (req, res, next) => {
  try {
    // QUERY 5
    await archiveProject(getDb(), new ObjectId(req.params.id));
    res.redirect('/projects');
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const projectId = new ObjectId(req.params.id);
    const status = req.query.status || null;
    // QUERY 6 (used here for the project detail page)
    const tasks = await listProjectTasks(getDb(), projectId, status);
    const project = await getDb().collection('projects').findOne({ _id: projectId });
    res.render('project-detail', { project, tasks, currentStatus: status });
  } catch (err) { next(err); }
});

module.exports = router;
