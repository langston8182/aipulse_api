/**
 * Fonction d'interpolation pour remplacer les placeholders dans un template
 * Exemple : ${confirmationUrl} et ${siteTitle}
 */
export function interpolate(template, variables) {
    return template.replace(/\$\{(\w+)\}/g, (_, key) => variables[key] || '');
}

/**
 * Génère une URL en fonction de l'environnement
 * @param {string} path - Le chemin à ajouter (ex: "/auth/callback")
 * @returns {string} L'URL complète adaptée à l'environnement
 */
export function getDynamicUrl(path) {
    const environment = process.env.ENVIRONMENT || "prod";  // Par défaut "prod"
    const subdomain = environment === "preprod" ? "preprod." : "";

    return `https://${subdomain}${process.env.HOST}${path}`;
}

export function getDynamicUrlForAuthRedirect(path) {
    const environment = process.env.ENVIRONMENT || "prod";  // Par défaut "prod"
    const subdomain = environment === "preprod" ? "preprod." : "www.";

    return `https://${subdomain}${process.env.HOST}${path}`;
}