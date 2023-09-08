const Job = require('../models/jobs-model');

exports.getJobs = async (req, res, next) => {
    const jobs = await Job.find();

    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
    });
}

exports.addJob = (req, res, next) => {
    try {
        const job = Job.create(req.body);

        res.status(201).json({
            success: true,
            message: 'job created',
            data: job,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}
