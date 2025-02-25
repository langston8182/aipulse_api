import { Token } from '../models/token.model.mjs';
import qs from 'querystring';
import jwt from 'jsonwebtoken';
import { UserInfo } from '../models/userinfo.model.mjs';

const COGNITO_DOMAIN = process.env.COGNITO_DOMAIN;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;
const REDIRECT_URI = process.env.COGNITO_REDIRECT_URI;

export async function exchangeCodeForToken(code) {
    const tokenEndpoint = `${COGNITO_DOMAIN}/oauth2/token`;
    const body = qs.stringify({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI
    });

    try {
        const response = await fetch(tokenEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body
        });
        const tokenData = await response.json();
        console.log("Réponse de l'échange de tokens :", tokenData);

        if (!response.ok) {
            return { error: tokenData, statusCode: response.status };
        }
        return new Token(tokenData);
    } catch (error) {
        console.error("Erreur durant l'échange de tokens :", error);
        return { error: error.message, statusCode: 500 };
    }
}

export async function refreshAccessToken(refreshToken) {
    const tokenEndpoint = `${COGNITO_DOMAIN}/oauth2/token`;
    const body = qs.stringify({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken,
    });

    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    });

    if (!response.ok) {
        throw new Error(`Erreur lors du renouvellement du token : ${response.statusText}`);
    }

    const data = await response.json();
    return new Token(data);
}

export async function extractUserInfoFromIdToken(idToken) {
    const decodedIdToken = jwt.decode(idToken);

    // Extraire les informations de profil (nom et prénom)
    const firstName = decodedIdToken.given_name || '';
    const lastName = decodedIdToken.family_name || '';
    return new UserInfo(firstName, lastName);
}

export function extractTokenFromCookies(cookieArray) {
    const cookies = cookieArray.reduce((acc, cookieStr) => {
        const [name, ...rest] = cookieStr.trim().split("=");
        acc[name] = rest.join("=");
        return acc;
    }, {});
    return cookies.id_token;
}
