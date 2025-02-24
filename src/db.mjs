import mongoose from 'mongoose';

let isConnected = false;

export async function connectToDatabase(uri) {
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
