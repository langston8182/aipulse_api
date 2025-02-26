import {
    createNewsletter,
    getAllNewsletter,
    deleteNewsletter,
    unsubscribeNewsletter,
    confirmNewsletter
} from '../services/newsletter.service.mjs';

import { sendEmail } from '../services/email.service.mjs';
import { Email } from "../models/email.model.mjs";
import {getDynamicUrl, interpolate} from "../utils/utils.mjs";

const NEWSLETTER_REDIRECT = getDynamicUrl("/unsubscribe")
const NEWSLETTER_CONFIRM_REDIRECT = getDynamicUrl("/newsletter/confirm")
const EMAIL_NEWSLETTER_HTML_BODY = process.env.EMAIL_NEWSLETTER_HTML_BODY;
const EMAIL_NEWSLETTER_TEXT_BODY = process.env.EMAIL_NEWSLETTER_TEXT_BODY;
const email_uri = process.env.ENVIRONMENT === "preprod"
    ? "https://api-preprod.ai-pulse-news.com"
    : "https://api.ai-pulse-news.com";

/**
 * Contrôleur pour router la requête selon la méthode et le chemin.
 */
export async function newsletterController(httpMethod, path, body, queryParams) {
    const env = process.env.ENVIRONMENT || "preprod";
    if (httpMethod === 'GET' && path === `/${env}/newsletter`) {
        const newsletters = await getAllNewsletter();
        return { statusCode: 200, body: JSON.stringify(newsletters) };
    }

    if (httpMethod === 'POST' && path === `/${env}/newsletter`) {
        const created = await createNewsletter(body);
        const confirmationUrl = getDynamicUrl("")
        const variables = {
            confirmationUrl: `${email_uri}/newsletter/confirm?token=${created.confirm_token}&amp;email=${created.email}`,
            siteTitle: "ai-pulse-news"
        };
        const emailModel = new Email(
            body.email,
            "Confirmez votre inscription à ai-pulse-news.com !",
            interpolate(process.env.EMAIL_CONFIRMATION_HTML_BODY, variables),
            interpolate(process.env.EMAIL_CONFIRMATION_HTML_BODY, variables)
        );
        await sendEmail(emailModel, true);
        return { statusCode: 201, body: JSON.stringify(created) };
    }

    // Ajout de la gestion de la confirmation
    if (httpMethod === 'GET' && path === `/${env}/newsletter/confirm`) {
        try {
            const { email, token } = queryParams || {};
            if (!email || !token) {
                return { statusCode: 400, body: JSON.stringify({ message: "Email et token sont requis" }) };
            }
            const updatedNewsletter = await confirmNewsletter(email, token);

            const variables = {
                unsubscribeUrl: `${email_uri}/newsletter/unsubscribe?token=${token}&amp;email=${email}`,
                siteTitle: "ai-pulse-news"
            };
            const emailModel = new Email(
                email,
                "Confirmez votre inscription à ai-pulse-news.com !",
                interpolate(EMAIL_NEWSLETTER_HTML_BODY, variables),
                interpolate(EMAIL_NEWSLETTER_TEXT_BODY, variables)
            );
            console.log('email : ', email);
            await sendEmail(emailModel, true);

            return {
                statusCode: 302,
                headers: {
                    Location: NEWSLETTER_CONFIRM_REDIRECT
                },
                body: JSON.stringify({ updatedNewsletter })
            };
        } catch (error) {
            return { statusCode: 400, body: JSON.stringify({ message: error.message }) };
        }
    }

    if (httpMethod === 'DELETE' && path.startsWith(`/${env}/newsletter/`)) {
        const email = path.split('/').pop();
        const deleted = await deleteNewsletter(email);
        if (!deleted) {
            return { statusCode: 404, body: JSON.stringify({ message: 'Not found' }) };
        }
        return { statusCode: 200, body: JSON.stringify({ message: 'Deleted' }) };
    }

    if (httpMethod === 'GET' && path === `/${env}/newsletter/unsubscribe`) {
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
