import { Article } from '../models/article.model.mjs';

/**
 * Create a new article.
 */
export async function createArticle(articleData) {
    const article = new Article(articleData);
    return await article.save();
}

/**
 * Get all articles.
 */
export async function getAllArticles() {
    return Article.find({});
}

/**
 * Get article by ID.
 */
export async function getArticleById(articleId) {
    return Article.findById(articleId);
}

/**
 * Update article by ID.
 */
export async function updateArticle(articleId, updateData) {
    return Article.findOneAndUpdate({_id: articleId}, updateData, {new: true});
}

/**
 * Delete article by ID.
 */
export async function deleteArticle(articleId) {
    return Article.findOneAndDelete({_id: articleId});
}
