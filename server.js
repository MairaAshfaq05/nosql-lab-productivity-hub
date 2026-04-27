// server.js
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');
const { connect } = require('./db/connection');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const noteRoutes = require('./routes/notes');
const dashboardRoutes = require('./routes/dashboard');

const PORT = process.env.PORT || 3000;

(async () => {
  await connect();

  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(session({
    secret: process.env.SESSION_SECRET || 'lab-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  }));
  app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  });
  app.use('/', authRoutes);
  app.use('/projects', projectRoutes);
  app.use('/tasks', taskRoutes);
  app.use('/notes', noteRoutes);
  app.use('/dashboard', dashboardRoutes);
  app.get('/', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.redirect('/login');
  });
  app.use((err, req, res, next) => {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).render('error', {
        title: 'Conflict',
        message: 'A user with that email already exists.'
      });
    }
    res.status(500).render('error', {
      title: 'Error',
      message: err.message || 'Something went wrong.'
    });
  });

  app.listen(PORT, () => {
    console.log(`✓ Server running at http://localhost:${PORT}`);
  });
})().catch(err => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
