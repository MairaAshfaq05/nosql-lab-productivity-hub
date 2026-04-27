// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db/connection');
const { signupUser, loginFindUser } = require('../db/queries');

const router = express.Router();

router.get('/signup', (req, res) => res.render('signup', { error: null }));
router.get('/login', (req, res) => res.render('login', { error: null }));

router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.render('signup', { error: 'All fields required.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    // QUERY 1
    const result = await signupUser(getDb(), { email, passwordHash, name });
    req.session.user = { _id: result.insertedId, email, name };
    res.redirect('/dashboard');
  } catch (err) {
    if (err.code === 11000) {
      return res.render('signup', { error: 'Email already registered.' });
    }
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // QUERY 2
    const user = await loginFindUser(getDb(), email);
    if (!user) return res.render('login', { error: 'Invalid credentials.' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.render('login', { error: 'Invalid credentials.' });
    req.session.user = { _id: user._id, email: user.email, name: user.name };
    res.redirect('/dashboard');
  } catch (err) { next(err); }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
