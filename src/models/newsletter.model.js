const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    token: String
});

module.exports = mongoose.model('Newsletter', newsletterSchema);
