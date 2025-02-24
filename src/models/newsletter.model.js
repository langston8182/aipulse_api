const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    confirm_token: String,
    status: String,
    created_date: Date
});

module.exports = mongoose.model('Newsletter', newsletterSchema);
