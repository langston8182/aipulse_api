const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    token: String,
    confirm_token: String,
    status: String
});

module.exports = mongoose.model('Newsletter', newsletterSchema);
