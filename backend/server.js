import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import clientRoutes from './routes/clientRoutes.js';
import cors from 'cors';

dotenv.config();


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/clients', clientRoutes);

// Database connection (for Vercel serverless)
let isConnected = false;

async function connectDB() {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
}

export default async function handler(req, res) {
    await connectDB();
    app(req, res);
}