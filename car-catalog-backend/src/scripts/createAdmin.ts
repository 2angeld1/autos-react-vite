import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

// Load environment variables
dotenv.config();

// Import functions directly without aliases
import { connectWithRetry } from '../config/database';

// Define User interface and schema directly in this file
interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const User = mongoose.model<IUser>('User', UserSchema);

async function createAdmin(): Promise<void> {
  try {
    console.log('🔧 Starting admin creation...');
    
    // Connect to database
    await connectWithRetry();
    console.log('✅ Connected to database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      email: 'admin@carcatalog.com' 
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email: admin@carcatalog.com');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Name:', existingAdmin.name);
      console.log('🔑 Role:', existingAdmin.role);
      
      // Update password anyway
      const newPassword = 'admin123';
      const hashedPassword = await bcryptjs.hash(newPassword, 12);
      
      await User.findByIdAndUpdate(existingAdmin._id, {
        password: hashedPassword,
        isActive: true,
        role: 'admin'
      });
      
      console.log('🔄 Admin password updated to: admin123');
      process.exit(0);
    }

    // Create new admin user
    const adminData = {
      name: 'Administrator',
      email: 'admin@carcatalog.com',
      password: 'admin123',
      role: 'admin' as const,
      isActive: true
    };

    // Hash password
    const hashedPassword = await bcryptjs.hash(adminData.password, 12);

    // Create admin user
    const adminUser = new User({
      ...adminData,
      password: hashedPassword
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@carcatalog.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    console.log('');
    console.log('🚀 You can now login to the admin dashboard');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
    process.exit(0);
  }
}

// Execute the function
createAdmin();