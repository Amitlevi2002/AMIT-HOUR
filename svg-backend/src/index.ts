import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/svg-db';

app.use(cors());
app.use(express.json());

// MongoDB Connection
const maskedURI = MONGO_URI.replace(/:([^@]+)@/, ':****@');
console.log(`Attempting to connect to MongoDB: ${maskedURI}`);

mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 30000, // Wait 30 seconds for server selection
    connectTimeoutMS: 30000,         // Wait 30 seconds for initial connection
})
    .then(() => console.log('Connected to MongoDB Atlas successfully'))
    .catch(err => {
        console.error('CRITICAL: MongoDB connection error details:');
        console.error(err);
    });

// Disable buffering so queries fail fast if not connected
mongoose.set('bufferCommands', false);

import designRoutes from './routes/designs';

// Routes
app.use('/', designRoutes);

// File Upload Setup
const upload = multer({ storage: multer.memoryStorage() });

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
