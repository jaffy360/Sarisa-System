const express = require('express');
const { db } = require('../../src/db');
const { requireAuth, requireRole } = require('../../src/utils');

const router = express.Router();
router.use(requireAuth, requireRole('child'));

router.get('/tasks', (req, res) => {
  const id = req.session.user.id;
  db.all(`SELECT * FROM tasks WHERE child_id=? ORDER BY created_at DESC`, [id], (err, rows)=>{
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/tasks', (req, res) => {
  const id = req.session.user.id;
  const { title, priority } = req.body || {};
  if (!title) return res.status(400).json({ error: 'title required' });
  db.run(`INSERT INTO tasks(child_id,title,priority) VALUES(?,?,?)`, [id, title, priority||0], function(err){
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

router.patch('/tasks/:taskId', (req, res) => {
  const id = req.session.user.id;
  const taskId = req.params.taskId;
  const { status } = req.body || {};
  db.run(`UPDATE tasks SET status=? WHERE id=? AND child_id=?`, [status||'done', taskId, id], function(err){
    if (err) return res.status(400).json({ error: err.message });
    res.json({ ok: true });
  });
});

module.exports = router;
