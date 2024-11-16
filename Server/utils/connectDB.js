import mongoose from "mongoose";

mongoose.set("strictQuery", true);

async function connectDB(uri) {
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000 // optional: set a timeout
        });
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

export { connectDB };
