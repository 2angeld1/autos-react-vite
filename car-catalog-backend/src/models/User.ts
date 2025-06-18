import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '@/types/user';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  getPublicProfile(): Omit<IUser, 'password'>;
}

const UserSchema = new Schema<IUserDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    index: true
  },
  avatar: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(_doc, ret) {
      delete ret.password;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes
UserSchema.index({ email: 1, isActive: 1 });
UserSchema.index({ role: 1, isActive: 1 });

// Virtual for user stats
UserSchema.virtual('memberSince').get(function(this: IUserDocument) {
  return this.createdAt;
});

// Pre-save middleware to hash password
UserSchema.pre('save', async function(this: IUserDocument, next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Pre-save middleware to update email
UserSchema.pre('save', function(this: IUserDocument, next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get public profile
UserSchema.methods.getPublicProfile = function(): Omit<IUser, 'password'> {
  const userObject = this.toObject();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...publicProfile } = userObject;
  return publicProfile;
};

// Static method to find by email
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase(), isActive: true });
};

// Static method to find active users
UserSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

export default mongoose.model<IUserDocument>('User', UserSchema);