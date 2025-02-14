const Article = require('../models/article.model');

/**
 * Create a new article.
 */
async function createArticle(articleData) {
    const article = new Article(articleData);
    return await article.save();
}

/**
 * Get all articles.
 */
async function getAllArticles() {
    return Article.find({});
}

/**
 * Get article by ID.
 */
async function getArticleById(articleId) {
    return Article.findById(articleId);
}

/**
 * Update article by ID.
 */
async function updateArticle(articleId, updateData) {
    return Article.findOneAndUpdate({_id: articleId}, updateData, {new: true});
}

/**
 * Delete article by ID.
 */
async function deleteArticle(articleId) {
    return Article.findOneAndDelete({_id: articleId});
}

module.exports = {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle
};
