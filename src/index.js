const { connectToDatabase } = require('./db');
const { articleController } = require('./controllers/article.controller');
const { newsletterController } = require('./controllers/newsletter.controller');
const { parametersController } = require('./controllers/parameters.controller');
const { emailController } = require('./controllers/email.controller');
const { openaiController } = require('./controllers/openai.controller');
const { imagesController } = require('./controllers/image.controller');
const { authController } = require('./controllers/auth.controller');


exports.handler = async (event) => {
    console.log('Incoming event:', JSON.stringify(event, null, 2));

    // 1. Connexion MongoDB
    await connectToDatabase(process.env.MONGODB_URI);

    // 2. Extraire les infos de la requête
    const httpMethod = event.requestContext.http.method;
    const path = event.requestContext.http.path;

    let body;
    try {
        body = event.body ? JSON.parse(event.body) : {};
    } catch (err) {
        body = {};
    }

    // 3. Appeler le contrôleur approprié en fonction du chemin
    let result;
    if (path.startsWith('/article')) {
        result = await articleController(httpMethod, path, body);
    } else if (path.startsWith('/newsletter')) {
        result = await newsletterController(httpMethod, path, body, event.queryStringParameters);
    } else if (path.startsWith('/admin/parameters')) {
        result = await parametersController(httpMethod, path, body);
    } else if (path.startsWith('/admin/email')) {
        result = await emailController(httpMethod, path, body);
    } else if (path.startsWith('/admin/openai')) {
        result = await openaiController(httpMethod, path, body);
    } else if (path.startsWith('/admin/images')) {
        result = await imagesController(httpMethod, path, body);
    } else if (path.startsWith('/auth')) {
        result = await authController(httpMethod, path, body, event.queryStringParameters, event.headers, event.cookies);
    }
    else {
        result = {
            statusCode: 404,
            body: JSON.stringify({ message: 'Not Found' }),
        };
    }

    // 4. Retourner la réponse
    return {
        ...result,
        headers: {
            ...result.headers,  // On récupère tous les headers de result (dont Location)
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
};
