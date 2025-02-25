import { v4 as uuidv4 } from 'uuid';
import { Newsletter } from '../models/newsletter.model.mjs';

/**
 * Create a new newsletter email.
 */
export async function createNewsletter(newsletterData) {
    const newsletter = new Newsletter({
        ...newsletterData,
        confirm_token: uuidv4(),
        status: "PENDING",
        created_at: new Date()
    });
    return await newsletter.save();
}

/**
 * Get all newsletter emails.
 */
export async function getAllNewsletter() {
    return Newsletter.find({});
}

/**
 * Delete a newsletter by email.
 */
export async function deleteNewsletter(email) {
    return Newsletter.findOneAndDelete({ email: email });
}

/**
 * Confirm newsletter subscription by email and token.
 * Si l'inscription avec le bon email, confirm_token et en statut "PENDING" existe,
 * le statut est mis à jour en "CONFIRMED".
 * Sinon, une erreur est levée.
 */
export async function confirmNewsletter(email, token) {
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
export async function unsubscribeNewsletter(email, token) {
    return Newsletter.findOneAndDelete({ email: email, confirm_token: token });
}
