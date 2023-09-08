const nodeGeocoder = require('node-geocoder');

const options = {
    provider: process.env.GEOCODER_PROVIDER,
    apiKey: process.env.GEOCODER_KEY,
    httpAdapter: 'https',
    formatter: null
}

const geocoder = nodeGeocoder(options);

module.exports = geocoder;