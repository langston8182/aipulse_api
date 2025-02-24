import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { Email } from '../models/email.model.mjs';
import { Newsletter } from '../models/newsletter.model.mjs';

const sesClient = new SESClient({ region: process.env.AWS_REGION || 'eu-west-3' });

/**
 * Envoie un email en utilisant le modèle Email.
 * @param {Email} emailData - Instance de Email contenant les données de l'email.
 * @param {boolean} bypassStatus - Si true, envoie un email sans vérifier le statut de l'email.
 */
export async function sendEmail(emailData, bypassStatus = false) {
    const emailModel = new Email(
        emailData.to,
        emailData.subject,
        emailData.htmlBody,
        emailData.textBody,
        emailData.bccAddresses
    );

    if (!(emailModel instanceof Email)) {
        throw new Error('Invalid email model');
    }

    // Vérification des propriétés requises
    if (!emailModel.to || !emailModel.subject || (!emailModel.htmlBody && !emailModel.textBody)) {
        throw new Error('Missing required email parameters');
    }

    if (!bypassStatus) {
        const existingNewsletter = await Newsletter.findOne({ email: emailModel.to });

        if (!existingNewsletter) {
            throw new Error(`L'email ${emailModel.to} n'existe pas dans la base de données.`);
        }

        if (existingNewsletter.status !== "CONFIRMED") {
            throw new Error(`L'email ${emailModel.to} n'a pas le statut CONFIRMED.`);
        }
    }

    const params = {
        Source: process.env.SOURCE_EMAIL, // ex: "votre-adresse@domaine.com"
        Destination: {
            ToAddresses: [emailModel.to],  // Transformé en tableau pour SES
            BccAddresses: emailModel.bccAddresses,
        },
        Message: {
            Subject: {
                Data: emailModel.subject,
                Charset: 'UTF-8',
            },
            Body: {},
        },
    };

    if (emailModel.htmlBody) {
        params.Message.Body.Html = {
            Data: emailModel.htmlBody,
            Charset: 'UTF-8',
        };
    }

    if (emailModel.textBody) {
        params.Message.Body.Text = {
            Data: emailModel.textBody,
            Charset: 'UTF-8',
        };
    }

    const command = new SendEmailCommand(params);
    return await sesClient.send(command);
}
