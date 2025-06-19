import { Types } from 'mongoose';

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserAuth {
  email: string;
  password: string;
}

export interface IUserRegistration {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IAuthResponse {
  success: boolean;
  token: string;
  user: Omit<IUser, 'password'>;
  expiresIn: string;
}

export interface IUserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}