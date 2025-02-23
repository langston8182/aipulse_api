/**
 * Fonction d'interpolation pour remplacer les placeholders dans un template
 * Exemple : ${confirmationUrl} et ${siteTitle}
 */
function interpolate(template, variables) {
    return template.replace(/\$\{(\w+)\}/g, (_, key) => variables[key] || '');
}

module.exports = {
    interpolate
};
