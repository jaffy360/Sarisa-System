const express = require('express');
const { db } = require('../../src/db');
const { requireAuth, requireRole } = require('../../src/utils');

const router = express.Router();
router.use(requireAuth, requireRole('child'));

router.get('/', (req, res) => {
  const id = req.session.user.id;
  db.get(`SELECT * FROM settings WHERE child_id=?`, [id], (err, row)=>{
    if (err) return res.status(400).json({ error: err.message });
    res.json(row || {});
  });
});

router.post('/', (req, res) => {
  const id = req.session.user.id;
  const { color_contrast, font_size, sound_cues, focus_minutes, break_minutes } = req.body || {};
  db.run(`INSERT INTO settings(child_id) VALUES(?) ON CONFLICT(child_id) DO NOTHING`, [id], ()=>{
    db.run(`UPDATE settings SET
      color_contrast=COALESCE(?,color_contrast),
      font_size=COALESCE(?,font_size),
      sound_cues=COALESCE(?,sound_cues),
      focus_minutes=COALESCE(?,focus_minutes),
      break_minutes=COALESCE(?,break_minutes)
      WHERE child_id=?`,
      [color_contrast, font_size, sound_cues, focus_minutes, break_minutes, id],
      function(err){ if (err) return res.status(400).json({ error: err.message }); res.json({ ok: true }); });
  });
});

module.exports = router;
