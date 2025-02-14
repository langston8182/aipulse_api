const {
    getAllParameters,
    updateParameters
} = require('../services/parameters.service');

async function parametersController(httpMethod, path, body) {
    if (httpMethod === 'GET' && path === '/admin/parameters') {
        const parameters = await getAllParameters();
        return {statusCode: 200, body: JSON.stringify(parameters)};
    }

    if (httpMethod === 'PUT' && path === '/admin/parameters') {
        const { parameters } = body

        if (!Array.isArray(parameters)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Le payload doit contenir une liste 'parameters'." })
            };
        }

        const updateResults = await updateParameters(parameters);  // Passe le tableau des paramètres
        const hasErrors = updateResults.some(result => result.status === 'error');

        if (hasErrors) {
            const errorResponse = {
                message: "Erreur lors de la mise à jour de certains paramètres.",
                results: updateResults
            };
            console.error("Erreur détectée :", errorResponse);
            throw new Error(JSON.stringify(errorResponse));
        }
        return { statusCode: 200, body: JSON.stringify(updateResults) };
    }

    // Route par défaut pour les requêtes non prises en charge
    return {statusCode: 404, body: JSON.stringify({message: 'Route non trouvée'})};
}

module.exports = {
    parametersController
};