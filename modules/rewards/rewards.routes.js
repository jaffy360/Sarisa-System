const express = require('express');
const { db } = require('../../src/db');
const { requireAuth, requireRole } = require('../../src/utils');

const router = express.Router();
router.use(requireAuth, requireRole('child'));

router.get('/', (req, res)=>{
  const id = req.session.user.id;
  db.all(`SELECT * FROM rewards WHERE child_id=? ORDER BY created_at DESC`, [id], (err, rows)=>{
    if (err) return res.status(400).json({ error: err.message });
    const total = rows.reduce((s,r)=> s + (r.points||0), 0);
    res.json({ total, items: rows });
  });
});

module.exports = router;
