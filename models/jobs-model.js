const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const jobsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter job title.'],
        trim: true,
        maxlength: [100, 'Job title max length of 100 characters.']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please enter job description.'],
        maxlength: [1000, 'Job description max length of 1000 characters.']
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'Please add valid email address.']
    },
    address: {
        type: String,
        required: [true, 'Please add an address.']
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    company: {
        type: String,
        required: [true, 'Please add company name.']
    },
    industry: {
        type: [String],
        required: true,
        enum: {
            values: [
                'Business',
                'Information Technology',
                'Banking',
                'Education/Training',
                'Telecommunications',
                'Others'
            ],
            message: 'Please select correct options for industry.'
        }
    },
    jobType: {
        type: String,
        required: true,
        enum: {
            values: [
                'Permanent',
                'Temporary',
                'Internship'
            ],
            message: 'Please select correct options for job type.'
        }
    },
    minEducation: {
        type: String,
        required: true,
        enum: {
            values: [
                'Bachelors',
                'Masters',
                'Phd'
            ],
            message: 'Please select correct options for education.'
        }
    },
    positions: {
        type: Number,
        default: 1
    },
    experience: {
        type: String,
        required: true,
        enum: {
            values: [
                'No experience',
                '1 - 2 years',
                '2 - 5 years',
                '5+ years'
            ],
            message: 'Please select correct options for experience.'
        }
    },
    salary: {
        type: String,
        required: 'Please enter expected salary for this job.'
    },
    postingDate: {
        type: Date,
        default: Date.now(),
    },
    lastDate: {
        type: Date,
        default: new Date().setDate(new Date().getDate() + 7)
    },
    applicantsApplied: {
        type: [Object],
        select: false
    }
});

jobsSchema.pre('save', function(next) {
    this.slug = slugify(this.title, {lower: true});

    next();
});

jobsSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address);

    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        city: loc[0].city,
        state: loc[0].state,
        zipcode: loc[0].zipcode,
        country: loc[0].country
    }

    next();
});

module.exports = mongoose.model('Job', jobsSchema);
