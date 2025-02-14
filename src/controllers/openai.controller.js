const {callOpenAI} = require("../services/openai.service");

async function openaiController(httpMethod, path, body) {
    if (httpMethod === 'POST' && path === '/admin/openai') {
        try {
            const response = await callOpenAI(body);
            return {statusCode: 200, body: JSON.stringify(response)};
        } catch (error) {
            console.error('Error in openaiController:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({message: 'Failed to call OpenAI'}),
            };
        }
    }
}

module.exports = {
    openaiController
};
