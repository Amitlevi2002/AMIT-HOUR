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
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

import designRoutes from './routes/designs';

// Routes
app.use('/', designRoutes);

// File Upload Setup
const upload = multer({ storage: multer.memoryStorage() });

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
