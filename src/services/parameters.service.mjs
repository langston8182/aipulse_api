import { SSMClient, GetParametersByPathCommand, PutParameterCommand } from "@aws-sdk/client-ssm";
import { CodePipeline } from "@aws-sdk/client-codepipeline";
import { Parameter } from "../models/parameters.model.mjs";

const ssmClient = new SSMClient({ region: process.env.AWS_REGION || "eu-west-3" });

/**
 * Get all parameters.
 */
export async function getAllParameters() {
    const params = [];
    let nextToken;

    do {
        const command = new GetParametersByPathCommand({
            Path: "/ai-pulse/",
            Recursive: true,
            MaxResults: 10,
            NextToken: nextToken,
        });

        const response = await ssmClient.send(command);
        if (response.Parameters) {
            // Utilise le modèle Parameter pour formater les résultats
            const formattedParams = response.Parameters.map(param => new Parameter(param.Name, param.Value));
            params.push(...formattedParams);
        }
        nextToken = response.NextToken;
    } while (nextToken);

    return params;
}

/**
 * Modify a parameter by name.
 */
export async function updateParameters(parameters) {
    const results = [];

    for (const param of parameters) {
        const command = new PutParameterCommand({
            Name: param.name,
            Value: param.value,
            Type: "String",
            Overwrite: true
        });

        try {
            const response = await ssmClient.send(command);
            results.push({ name: param.name, status: "success", version: response.Version });
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du paramètre ${param.name}:`, error);
            results.push({ name: param.name, status: "error", error: error.message });
        }
    }

    // Launch pipeline to restart application ui
    const codepipeline = new CodePipeline({});
    const pipelineName = "ai-pulse-ui-pipeline";
    try {
        await codepipeline.startPipelineExecution({ name: pipelineName });
    } catch (error) {
        return { statusCode: 500, body: `Erreur: ${error.message}` };
    }

    return results;
}
