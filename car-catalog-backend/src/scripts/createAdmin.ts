import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '@/models/User';
import { hashPassword } from '@/utils/helpers';

// Load environment variables
dotenv.config();

async function createAdmin(): Promise<void> {
  try {
    console.log('🔧 Starting admin creation (Mongoose)...');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-catalog';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const email = 'admin@carcatalog.com';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email:', email);

      // Update password anyway
      const newPassword = 'admin123';
      const hashedPassword = await hashPassword(newPassword);

      await User.findByIdAndUpdate(existingAdmin._id, { 
        password: hashedPassword, 
        isActive: true, 
        role: 'admin' 
      });

      console.log('🔄 Admin password updated to: admin123');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create new admin user
    const adminData = {
      name: 'Administrator',
      email,
      password: 'admin123',
      role: 'admin' as const,
      isActive: true
    };

    // Hash password
    const hashedPassword = await hashPassword(adminData.password);

    // Create admin user
    await User.create({ 
      name: adminData.name, 
      email: adminData.email, 
      password: hashedPassword, 
      role: adminData.role, 
      isActive: true 
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    console.log('🚀 You can now login to the admin dashboard');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Execute the function
createAdmin();