import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    title: String,
    summary: String,
    content: String,
    imageUrl: String,
    category: String,
    publishedAt: String,
    author: String,
    readTime: Number
});

export const Article = mongoose.model('Article', articleSchema);
