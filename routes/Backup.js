const express = require('express');
const router = express.Router();
const BackupControler = require('../controllers/Backup');

router.route('/').get(BackupControler.getBackup);

module.exports = router;