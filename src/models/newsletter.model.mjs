import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    confirm_token: String,
    status: String,
    created_date: Date
});

export const Newsletter = mongoose.model('Newsletter', newsletterSchema);
