const Job = require('../models/jobs-model');
const geocoder = require('../utils/geocoder');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

exports.getJobs = catchAsyncErrors(async (req, res, next) => {
    const jobs = await Job.find();

    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
    });
});

exports.addJob = catchAsyncErrors(async (req, res, next) => {
    const job = await Job.create(req.body);

    res.status(201).json({
        success: true,
        message: 'job created',
        data: job,
    });
});

exports.getJobsInRadius = catchAsyncErrors(async (req, res, next) => {
    const {zipcode, distance} = req.params;

    const loc = await geocoder.geocode(zipcode);
    const latitude = loc[0].latitude;
    const longitude = loc[0].longitude;

    const radius = distance / 3963;

    const jobs = await Job.find({
        location: {$geoWithin: {$centerSphere: [[longitude, latitude], radius]}}
    });

    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
    });
});

exports.updateJob = catchAsyncErrors(async (req, res, next) => {
    const job = await Job.findById(req.params.id);

    if (job) {
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Job updated',
            data: updatedJob
        });
    } else {
        next(new ErrorHandler('Job not found', 404))
    }
});

exports.deleteJob = catchAsyncErrors(async (req, res, next) => {
    const job = await Job.findById(req.params.id);

    if (job) {
        await Job.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Job deleted'
        });
    } else {
        next(new ErrorHandler('Job not found', 404))
    }
});

exports.getJob = catchAsyncErrors(async (req, res, next) => {
    const job = await Job.findById(req.params.id);

    if (job) {
        res.status(200).json({
            success: true,
            data: job,
        });
    } else {
        return next(new ErrorHandler('Job not found', 404))
    }
});

exports.getJobStats = catchAsyncErrors(async (req, res, next) => {
    const stats = await Job.aggregate([
        {
            $match: {
                $text: {
                    $search: "\""+req.params.topic+"\""
                }
            }
        },
        {
            $group: {
                _id: {
                    $toUpper: "$experience"
                },
                totalJobs: {
                    $sum: 1
                },
                avgPositions: {
                    $avg: "$positions"
                },
                avgSalary: {
                    $avg: "$salary"
                },
                minSalary: {
                    $min: "$salary"
                },
                maxSalary: {
                    $max: "$salary"
                }
            }
        }
    ]);

    if (stats.length > 0) {
        res.status(200).json({
            success: true,
            data: stats
        });
    } else {
        res.status(200).json({
            success: false,
            message: 'No stats found'
        });
    }
});