import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import clientRoutes from './routes/clientRoutes.js';
import cors from 'cors';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/clients', clientRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(error => console.error('Database connection error:', error));