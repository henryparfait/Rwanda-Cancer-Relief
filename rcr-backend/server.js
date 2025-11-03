// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import profileRoutes from './routes/profile.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
// CORS configuration - allow all Vite development ports
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.match(/http:\/\/localhost:\d+/) || origin.match(/http:\/\/127.0.0.1:\d+/)) {
      return callback(null, true);
    }
    callback(new Error('CORS not allowed for this origin'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Rwanda Cancer Relief Backend',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Rwanda Cancer Relief API is running!',
    version: '1.0.0',
    features: 'Admin approval system for ALL users',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      admin: {
        pending_approvals: 'GET /api/admin/pending-approvals',
        approve_user: 'PUT /api/admin/approve/:userId',
        reject_user: 'PUT /api/admin/reject/:userId'
      },
      health: 'GET /api/health'
    }
  });
});


const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n RCR Backend Server Running!`);
    console.log(`Port: ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
    console.log(`\n AUTHENTICATION:`);
    console.log(`   • Single login: POST /api/auth/login`);
    console.log(`   • Detects user type automatically`);
    console.log(`   • Admins: Email + Password only`);
    console.log(`   • Patients/Counselors: Full registration`);
  });
};

startServer();