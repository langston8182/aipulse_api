const {
    createNewsletter,
    getAllNewsletter,
    deleteNewsletter,
    unsubscribeNewsletter,
    confirmNewsletter
} = require('../services/newsletter.service');
const {
    sendEmail
} = require('../services/email.service')
const {Email} = require("../models/email.model");
const {interpolate} = require("../utils/utils");
const NEWSLETTER_REDIRECT = process.env.NEWSLETTER_REDIRECT;
const NEWSLETTER_CONFIRM_REDIRECT = process.env.NEWSLETTER_CONFIRM_REDIRECT;
const EMAIL_NEWSLETTER_HTML_BODY = process.env.EMAIL_NEWSLETTER_HTML_BODY
const EMAIL_NEWSLETTER_TEXT_BODY = process.env.EMAIL_NEWSLETTER_TEXT_BODY

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
        const variables = {
            confirmationUrl: "https://api.ai-pulse-news.com/newsletter/confirm?token=" + created.confirm_token + "&amp;email=" + created.email,
            siteTitle: "ai-pulse-news"
        }
        const emailModel = new Email(
            body.email,
            "Confirmez votre inscription à ai-pulse-news.com !",
            interpolate(process.env.EMAIL_CONFIRMATION_HTML_BODY, variables),
            interpolate(process.env.EMAIL_CONFIRMATION_HTML_BODY, variables)
        );
        await sendEmail(emailModel, true)
        return { statusCode: 201, body: JSON.stringify(created) };
    }

    // Ajout de la gestion de la confirmation
    if (httpMethod === 'GET' && path === '/newsletter/confirm') {
        try {
            const { email, token } = queryParams || {};
            if (!email || !token) {
                return { statusCode: 400, body: JSON.stringify({ message: "Email et token sont requis" }) };
            }
            const updatedNewsletter = await confirmNewsletter(email, token);

            const variables = {
                unsubscribeUrl: "https://api.ai-pulse-news.com/newsletter/unsubscribe?token=" + token + "&amp;email=" + email,
                siteTitle: "ai-pulse-news"
            }
            const emailModel = new Email(
                email,
                "Confirmez votre inscription à ai-pulse-news.com !",
                interpolate(process.env.EMAIL_NEWSLETTER_HTML_BODY, variables),
                interpolate(process.env.EMAIL_NEWSLETTER_TEXT_BODY, variables)
            );
            console.log('email : ', email)
            await sendEmail(emailModel, true)

            return {
                statusCode: 302,
                headers: {
                    Location: NEWSLETTER_CONFIRM_REDIRECT
                },
                body: JSON.stringify({updatedNewsletter})
            };
        } catch (error) {
            return { statusCode: 400, body: JSON.stringify({ message: error.message }) };
        }
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
