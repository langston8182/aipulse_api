export class ChatPayload {
    constructor(model, messages = []) {
        this.model = model;
        this.messages = messages;
    }
}
