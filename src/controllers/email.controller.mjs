import { sendEmail } from '../services/email.service.mjs';

export async function emailController(httpMethod, path, body) {
    if (httpMethod === 'POST' && path === '/admin/email') {
        try {
            await sendEmail(body, false);
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Email sent successfully' }),
            };
        } catch (error) {
            console.error('Error in emailController:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Failed to send email' }),
            };
        }
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid request' }),
        };
    }
}
