const express = require('express');
const router = express.Router();

const {getJobs, addJob} = require('../controllers/jobController');

router.route('/jobs').get(getJobs);
router.route('/jobs').post(addJob);

module.exports = router;