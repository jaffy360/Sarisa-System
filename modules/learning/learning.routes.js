const express = require('express');
const { requireAuth } = require('../../src/utils');

const router = express.Router();
// Placeholder endpoints to expand later
router.use(requireAuth);
router.get('/ping', (_req, res)=> res.json({ ok: true, module: 'learning' }));

module.exports = router;
