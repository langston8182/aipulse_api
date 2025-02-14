class Email {
    constructor(to, subject, htmlBody, textBody, bccAddresses = []) {
        this.to = to;
        this.subject = subject;
        this.htmlBody = htmlBody;
        this.textBody = textBody;

        this.bccAddresses = Array.isArray(bccAddresses) ? bccAddresses : [];
    }
}

module.exports = { Email };