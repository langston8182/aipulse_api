import {
    exchangeCodeForToken,
    refreshAccessToken,
    extractTokenFromCookies,
    extractUserInfoFromIdToken
} from '../services/auth.service.mjs';

export async function authController(httpMethod, path, body, queryStringParameters, headers, cookies) {
    if (httpMethod === 'GET' && path === '/auth/callback') {
        const code = queryStringParameters?.code;
        if (!code) {
            console.error("Le paramètre 'code' est manquant");
            return {
                statusCode: 400,
                body: JSON.stringify({message: "Le paramètre 'code' est manquant"}),
            };
        }
        console.log("Code reçu :", code);

        const tokens = await exchangeCodeForToken(code);
        if (tokens.error) {
            console.error("Erreur lors de l'échange de code contre des tokens :", tokens.error);
            return {
                statusCode: tokens.statusCode || 500,
                body: JSON.stringify({message: "Échange de token échoué", error: tokens.error}),
            };
        }

        const {access_token, id_token, refresh_token} = tokens;
        if (!access_token || !id_token || !refresh_token) {
            return {
                statusCode: 500,
                body: JSON.stringify({message: "Réponse de token incomplète"}),
            };
        }

        // Définition des cookies
        const cookieOptions = "HttpOnly; Secure; SameSite=None; Path=/";
        const responseCookies = [
            `id_token=${id_token}; ${cookieOptions}`,
        ];
        console.log("Cookies envoyés :", responseCookies);

        return {
            statusCode: 200,
            headers: {
                "Set-Cookie": responseCookies.join(", "),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({message: "Authentification réussie"}),
        };
    }

    if (httpMethod === 'POST' && path === '/auth/userinfo') {
        try {
            console.log("Traitement de /userinfo");
            const idToken = extractTokenFromCookies(cookies);

            if (!idToken) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({error: 'id token manquant'}),
                };
            }

            const userInfo = await extractUserInfoFromIdToken(idToken);

            return {
                statusCode: 200,
                body: JSON.stringify(userInfo)
            };
        } catch (error) {
            console.error('Erreur dans authController (userInfo) :', error);
            return {
                statusCode: 500,
                body: JSON.stringify({message: 'Erreur lors de la récupération des informations utilisateur'}),
            };
        }
    }

    if (httpMethod === 'GET' && path === '/auth/signout') {
        return {
            statusCode: 200,
            headers: {
                "Set-Cookie": [
                    "id_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0",
                ].join(", "),
            },
            body: JSON.stringify({ message: "Déconnexion réussie" })
        };
    }

    if (httpMethod === 'POST' && path === '/auth/refresh') {
        try {
            const cookiesHeader = headers.Cookie || headers.cookie || '';
            const refreshToken = extractTokenFromCookies(cookiesHeader, 'refresh_token');

            if (!refreshToken) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({error: 'Refresh token manquant'}),
                };
            }

            const tokens = await refreshAccessToken(refreshToken);

            return {
                statusCode: 200,
                headers: {
                    'Set-Cookie': `access_token=${tokens.access_token}; HttpOnly; Secure; SameSite=Strict; Path=/`
                },
                body: JSON.stringify({message: 'Token renouvelé'})
            };
        } catch (error) {
            console.error('Erreur dans authController (refresh) :', error);
            return {
                statusCode: 500,
                body: JSON.stringify({message: 'Erreur lors du renouvellement du token'}),
            };
        }
    }

    return {
        statusCode: 404,
        body: JSON.stringify({message: 'Endpoint non trouvé'}),
    };
}
