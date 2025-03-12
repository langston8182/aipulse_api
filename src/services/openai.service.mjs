import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const AWS_REGION = process.env.AWS_REGION || "eu-west-3";
const MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0"

export async function callOpenAI(body) {
    const client = new BedrockRuntimeClient({ region: AWS_REGION });
    const systemMessage = body.messages.find(msg => msg.role === "system")?.content || "";
    const userMessage = body.messages.find(msg => msg.role === "user")?.content || "";
    const combinedMessage = `${systemMessage}\n\n${userMessage}`;
    const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 50000,
        temperature: 0.75,
        messages: [
            {
                role: "user",
                content: [{ type: "text", text: combinedMessage }]
            }
        ]
    };

    const response = await client.send(
        new InvokeModelCommand({
            contentType: "application/json",
            body: JSON.stringify(payload),
            modelId: MODEL_ID
        })
    )

    const decodedResponseBody = new TextDecoder().decode(response.body)
    const responseBody = JSON.parse(decodedResponseBody)
    const responses = responseBody.content;
    const modelResponse = responseBody.content[0]?.text || "";

    return {
        choices: [
            {
                message: {
                    content: modelResponse
                }
            }
        ]
    };
}
