const Newsletter = require('../models/newsletter.model');
const { v4: uuidv4 } = require('uuid');

/**
 * Create a new newsletter email.
 */
async function createNewsletter(newsletterData) {
    const newsletter = new Newsletter({
        ...newsletterData,
        confirm_token: uuidv4(),
        status: "PENDING",
        created_at: new Date()
    });
    return await newsletter.save();
}

/**
 * Get all newsletter email.
 */
async function getAllNewsletter() {
    return Newsletter.find({});
}

/**
 * Delete a newsletter by email.
 */
async function deleteNewsletter(email) {
    return Newsletter.findOneAndDelete({email: email});
}

/**
 * Confirm newsletter subscription by email and token.
 * Si l'inscription avec le bon email, confirm_token et en statut "PENDING" existe,
 * le statut est mis à jour en "CONFIRMED".
 * Sinon, une erreur est levée.
 */
async function confirmNewsletter(email, token) {
    const newsletter = await Newsletter.findOneAndUpdate(
        { email: email, confirm_token: token, status: "PENDING" },
        { status: "CONFIRMED" },
        { new: true } // Retourne le document mis à jour
    );
    if (!newsletter) {
        throw new Error("Aucune inscription trouvée avec cet email et token, ou elle a déjà été confirmée.");
    }
    return newsletter;
}

/**
 * Unsubscribe a newsletter by email and token.
 */
async function unsubscribeNewsletter(email, token) {
    return Newsletter.findOneAndDelete({email: email, confirm_token: token});
}

module.exports = {
    createNewsletter,
    getAllNewsletter,
    deleteNewsletter,
    unsubscribeNewsletter,
    confirmNewsletter
};
