import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

async function createArchitect(): Promise<void> {
  try {
    console.log('🏗️  Iniciando creación de Arquitecto (NEXUS CRM)...');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-catalog';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    const email = 'architect@nexus.com';
    const password = 'architect123';
    const name = 'Angel Arquitecto';

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('⚠️  El usuario ya existe con el email:', email);

      // Actualizar a rol arquitecto y resetear password (el hook pre-save lo encriptará)
      existingUser.name = name;
      existingUser.password = password;
      existingUser.role = 'architect';
      existingUser.isActive = true;
      
      await existingUser.save();

      console.log('🔄 Usuario actualizado a rol ARCHITECT. Password: architect123');
    } else {
      // Create new architect user (el modelo lo encriptará en el .create)
      await User.create({ 
        name, 
        email, 
        password, 
        role: 'architect', 
        isActive: true 
      });

      console.log('✅ Usuario Arquitecto creado con éxito!');
      console.log('📧 Email:', email);
      console.log('🔑 Password: architect123');
      console.log('👤 Rol: architect');
    }

    console.log('🚀 Ya puedes iniciar sesión en NEXUS.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creandor el arquitecto:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

// Execute
createArchitect();
