import {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle
} from '../services/article.service.mjs';

/**
 * Contrôleur pour router la requête selon la méthode et le chemin.
 */
export async function articleController(httpMethod, path, body) {
    const env = process.env.ENVIRONMENT || "preprod";
    if (httpMethod === 'GET' && path === `/${env}/articles`) {
        const articles = await getAllArticles();
        return { statusCode: 200, body: JSON.stringify(articles) };
    }

    if (httpMethod === 'GET' && path.startsWith(`/${env}/articles/`)) {
        const articleId = path.split('/').pop();
        const article = await getArticleById(articleId);
        if (!article) {
            return { statusCode: 404, body: JSON.stringify({ message: 'Not found' }) };
        }
        return { statusCode: 200, body: JSON.stringify(article) };
    }

    if (httpMethod === 'POST' && path === `/${env}/articles`) {
        const created = await createArticle(body);
        return { statusCode: 201, body: JSON.stringify(created) };
    }

    if (httpMethod === 'PUT' && path.startsWith(`/${env}/articles/`)) {
        const articleId = path.split('/').pop();
        const updated = await updateArticle(articleId, body);
        if (!updated) {
            return { statusCode: 404, body: JSON.stringify({ message: 'Not found' }) };
        }
        return { statusCode: 200, body: JSON.stringify(updated) };
    }

    if (httpMethod === 'DELETE' && path.startsWith(`/${env}/articles/`)) {
        const articleId = path.split('/').pop();
        const deleted = await deleteArticle(articleId);
        if (!deleted) {
            return { statusCode: 404, body: JSON.stringify({ message: 'Not found' }) };
        }
        return { statusCode: 200, body: JSON.stringify({ message: 'Deleted' }) };
    }

    // Route par défaut
    return { statusCode: 404, body: JSON.stringify({ message: 'Not found' }) };
}
