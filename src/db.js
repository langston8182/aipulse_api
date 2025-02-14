const mongoose = require('mongoose');

let isConnected = false;

async function connectToDatabase(uri) {
    if (!isConnected) {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        isConnected = true;
        console.log('MongoDB connected');
    }
    return mongoose;
}

module.exports = {
    connectToDatabase
};
