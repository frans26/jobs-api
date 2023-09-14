const express = require('express');
const router = express.Router();

const {
    getJobs,
    getJob,
    addJob,
    getJobsInRadius,
    updateJob,
    deleteJob,
    getJobStats
} = require('../controllers/jobController');

router.route('/jobs').get(getJobs);
router.route('/jobs/:zipcode/:distance').get(getJobsInRadius);

router.route('/job').post(addJob);

router.route('/job/:id')
    .get(getJob)
    .put(updateJob)
    .delete(deleteJob);

router.route('/stats/:topic').get(getJobStats);

module.exports = router;