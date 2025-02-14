const {
    createNewsletter,
    getAllNewsletter,
    deleteNewsletter,
    unsubscribeNewsletter
} = require('../services/newsletter.service');
const NEWSLETTER_REDIRECT = process.env.NEWSLETTER_REDIRECT;

/**
 * Contrôleur pour router la requête selon la méthode et le chemin.
 */
async function newsletterController(httpMethod, path, body, queryParams) {
    if (httpMethod === 'GET' && path === '/newsletter') {
        const newsletters = await getAllNewsletter();
        return { statusCode: 200, body: JSON.stringify(newsletters) };
    }

    if (httpMethod === 'POST' && path === '/newsletter') {
        const created = await createNewsletter(body);
        return { statusCode: 201, body: JSON.stringify(created) };
    }

    if (httpMethod === 'DELETE' && path.startsWith('/newsletter/')) {
        const email = path.split('/').pop();
        const deleted = await deleteNewsletter(email);
        if (!deleted) {
            return { statusCode: 404, body: JSON.stringify({ message: 'Not found' }) };
        }
        return { statusCode: 200, body: JSON.stringify({ message: 'Deleted' }) };
    }

    if (httpMethod === 'GET' && path === '/newsletter/unsubscribe') {
        const email = queryParams?.email;
        const token = queryParams?.token;
        const deleted = await unsubscribeNewsletter(email, token);
        if (!deleted) {
            return { statusCode: 404, body: JSON.stringify({ message: 'Not found' }) };
        }
        return {
            statusCode: 302,
            headers: {
                Location: NEWSLETTER_REDIRECT
            },
            body: JSON.stringify({ message: 'Deleted' })
        };
    }

    // Route par défaut
    return { statusCode: 404, body: JSON.stringify({ message: 'Not found' }) };
}

module.exports = {
    newsletterController
};
