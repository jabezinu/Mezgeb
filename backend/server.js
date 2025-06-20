// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import clientRoutes from './routes/clientRoutes.js';
// import prospectRoutes from './routes/prospectRoutes.js';
// import cors from 'cors';

// dotenv.config();


// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Routes
// app.use('/api/clients', clientRoutes);
// app.use('/api/prospects', prospectRoutes);

// // Database connection (for Vercel serverless and local dev)
// let isConnected = false;

// async function connectDB() {
//     if (isConnected) return;
//     await mongoose.connect(process.env.MONGO_URI);
//     isConnected = true;
// }

// // Local development: start server if run directly
// if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
//     const PORT = process.env.PORT || 3000;
//     connectDB().then(() => {
//         app.listen(PORT, () => {
//             console.log(`Server running on http://localhost:${PORT}`);
//         });
//     }).catch((err) => {
//         console.error('Failed to connect to DB', err);
//     });
// }

// // Vercel serverless handler
// export default async function handler(req, res) {
//     await connectDB();
//     app(req, res);
// }



import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import clientRoutes from './routes/clientRoutes.js';
import prospectRoutes from './routes/prospectRoutes.js';
import cors from 'cors';

dotenv.config();


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/clients', clientRoutes);
app.use('/api/prospects', prospectRoutes);

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