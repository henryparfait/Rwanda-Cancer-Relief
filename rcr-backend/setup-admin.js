import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function setupAdmin() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.fullName}`);
      console.log(`   ID: ${existingAdmin._id}`);
      await mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash('admin@123', 12);

    const adminUser = await User.create({
      email: 'admin1@rcr.org',
      password: 'admin@123',
      role: 'admin',
      fullName: 'System Administrator',
      position: 'Head Administrator',
      isApproved: true,
      approvalStatus: 'approved',
    });

    console.log('🎉 ADMIN USER CREATED SUCCESSFULLY!');
    console.log('====================================');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔑 Password: ${adminUser.password}`);
    console.log(`👤 Name: ${adminUser.fullName}`);
    console.log(`👑 Role: ${adminUser.role}`);
    console.log('📍 Access: Full system access');
    console.log('\n💡 Use these credentials to login');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

setupAdmin();