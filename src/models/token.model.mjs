export class Token {
    constructor(data) {
        this.access_token = data.access_token;
        this.id_token = data.id_token;
        this.refresh_token = data.refresh_token;
        this.expires_in = data.expires_in;
        this.token_type = data.token_type;
    }
}