const express = require('express');
const { db } = require('../../src/db');
const { requireAuth, requireRole } = require('../../src/utils');

const router = express.Router();
router.use(requireAuth, requireRole('parent'));

// Link existing child account to this parent { childEmail }
router.post('/link-child', (req, res) => {
  const parentId = req.session.user.id;
  const { childEmail } = req.body || {};
  if (!childEmail) return res.status(400).json({ error: 'childEmail required' });
  db.get(`SELECT id, role FROM users WHERE email=?`, [childEmail], (err, child) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!child || child.role !== 'child') return res.status(404).json({ error: 'Child not found' });
    db.run(`INSERT OR IGNORE INTO parent_child(parent_id, child_id) VALUES(?,?)`, [parentId, child.id], function(err2){
      if (err2) return res.status(400).json({ error: err2.message });
      res.json({ ok: true });
    });
  });
});

// List my children + quick stats
router.get('/children', (req, res) => {
  const parentId = req.session.user.id;
  const sql = `
    SELECT u.id as child_id, u.name, u.email,
      (SELECT COUNT(*) FROM tasks t WHERE t.child_id=u.id) as total_tasks,
      (SELECT COUNT(*) FROM tasks t WHERE t.child_id=u.id AND t.status='done') as done_tasks,
      (SELECT COALESCE(SUM(points),0) FROM rewards r WHERE r.child_id=u.id) as points
    FROM parent_child pc
    JOIN users u ON u.id = pc.child_id
    WHERE pc.parent_id = ?
    ORDER BY u.name;
  `;
  db.all(sql, [parentId], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
