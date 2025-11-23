const express = require('express');
const session = require('express-session');
const path = require('path');

const { db } = require('./src/db');
const authRoutes = require('./modules/user/user.routes');
const parentRoutes = require('./modules/parent/parent.routes');
const childRoutes = require('./modules/child/child.routes');
const adaptiveRoutes = require('./modules/adaptive/adaptive.routes');
const learningRoutes = require('./modules/learning/learning.routes');
const rewardsRoutes = require('./modules/rewards/rewards.routes');

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'sarisa_local_secret',
  resave: false,
  saveUninitialized: false
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/child', childRoutes);
app.use('/api/adaptive', adaptiveRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/rewards', rewardsRoutes);

// ------------------------------
// ADHD ASSESSMENT API (MUST BE BEFORE app.listen())
// ------------------------------
app.post('/api/adhd-assessment', (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'parent') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { childId, inattentiveScore, hyperactiveScore } = req.body;

  const child_id = Number(childId);
  const inatt = Number(inattentiveScore);
  const hyper = Number(hyperactiveScore);

  if (!child_id || Number.isNaN(inatt) || Number.isNaN(hyper)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const combined = inatt + hyper;

  let category = '';
  if (combined < 10) {
    category = 'Low ADHD-like traits';
  } else if (inatt >= 14 && hyper < 14) {
    category = 'Mostly inattentive traits';
  } else if (hyper >= 14 && inatt < 14) {
    category = 'Mostly hyperactive traits';
  } else if (inatt >= 14 && hyper >= 14) {
    category = 'Combined traits';
  } else {
    category = 'Borderline traits';
  }

  db.run(
    `INSERT INTO adhd_assessment
      (child_id, inattentive_score, hyperactive_score, combined_score, category)
      VALUES (?,?,?,?,?)`,
    [child_id, inatt, hyper, combined, category],
    function (err) {
      if (err) {
        console.error("ADHD insert error", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({
        id: this.lastID,
        childId: child_id,
        inattentiveScore: inatt,
        hyperactiveScore: hyper,
        combinedScore: combined,
        category
      });
    }
  );
});

// ------------------------------
// FALLBACK ROUTE
// ------------------------------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ------------------------------
// START SERVER (MUST BE LAST)
// ------------------------------
app.listen(PORT, () => console.log(`SARISA running on http://localhost:${PORT}`));
