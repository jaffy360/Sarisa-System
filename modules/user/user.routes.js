const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../../src/db');

const router = express.Router();

// Register { name, email, password, role: 'parent'|'child' }
router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body || {};
  if (!name || !email || !password || !['parent','child'].includes(role)) {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }
  const hash = bcrypt.hashSync(password, 10);
  db.run(`INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,?)`,
    [name, email, hash, role],
    function(err){
      if (err) return res.status(400).json({ error: err.message });
      return res.json({ id: this.lastID });
    });
});

// Login { email, password } -> sets session
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  db.get(`SELECT * FROM users WHERE email=?`, [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    req.session.user = { id: user.id, role: user.role, name: user.name, email: user.email };
    res.json({ ok: true, user: req.session.user });
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy(()=> res.json({ ok: true }));
});

router.get('/me', (req, res)=>{
  res.json({ user: req.session.user || null });
});

module.exports = router;
