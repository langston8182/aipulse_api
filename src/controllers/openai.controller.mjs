import { callOpenAI } from "../services/openai.service.mjs";

export async function openaiController(httpMethod, path, body) {
    const env = process.env.ENVIRONMENT || "preprod";
    if (httpMethod === 'POST' && path === `/${env}/admin/openai`) {
        try {
            const response = await callOpenAI(body);
            return { statusCode: 200, body: JSON.stringify(response) };
        } catch (error) {
            console.error('Error in openaiController:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Failed to call OpenAI' }),
            };
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid request' }),
    };
}
