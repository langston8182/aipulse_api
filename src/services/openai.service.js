const fetch = require('node-fetch');
const {ChatPayload} = require("../models/openai.model");

async function callOpenAI(payload) {
    const apiKey = process.env.OPENAI_API_KEY;
    const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';
    const chatPayload = new ChatPayload("gpt-4o-mini", payload.messages)

    const response = await fetch(openaiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(chatPayload),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Erreur API OpenAI: ${err}`);
    }

    return await response.json();
}

module.exports = { callOpenAI };
