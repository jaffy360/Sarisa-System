const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const { db } = require('./src/db');
const authRoutes = require('./modules/user/user.routes');
const parentRoutes = require('./modules/parent/parent.routes');
const childRoutes = require('./modules/child/child.routes');
const adaptiveRoutes = require('./modules/adaptive/adaptive.routes');
const learningRoutes = require('./modules/learning/learning.routes');
const rewardsRoutes = require('./modules/rewards/rewards.routes');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'sarisa_local_secret',
  resave: false,
  saveUninitialized: false
}));

// static
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/child', childRoutes);
app.use('/api/adaptive', adaptiveRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/rewards', rewardsRoutes);

// health
app.get('/api/health', (_req, res)=> res.json({ ok: true }));

// fallback to login
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`SARISA running on http://localhost:${PORT}`));
