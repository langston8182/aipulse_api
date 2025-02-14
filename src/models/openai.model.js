class Message {
    constructor(role, content) {
        this.role = role;
        this.content = content;
    }
}

class ChatPayload {
    constructor(model, messages = []) {
        this.model = model;
        this.messages = messages
    }
}

module.exports = { ChatPayload };