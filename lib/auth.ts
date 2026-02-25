/**
 * Mock Authentication System
 * Handles signup, login, logout, and session management using localStorage
 */

import { User, AuthResponse } from './types';

// Mock credentials for testing
const MOCK_USER: User = {
  id: 'user_test_001',
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TestUser',
  plan: 'free',
  joined: new Date('2024-01-01').toISOString(),
  scans: [],
};

const SESSION_KEY = 'resumeiq_session';
const USER_KEY = 'resumeiq_user';

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password (minimum 6 characters)
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Mock signup function
 * Validates email and password, then stores user in localStorage
 */
export const signup = (email: string, password: string, name: string): AuthResponse => {
  try {
    // Validate inputs
    if (!email || !password || !name) {
      return {
        success: false,
        error: 'All fields are required',
      };
    }

    if (!validateEmail(email)) {
      return {
        success: false,
        error: 'Invalid email format',
      };
    }

    if (!validatePassword(password)) {
      return {
        success: false,
        error: 'Password must be at least 6 characters',
      };
    }

    // Check if user already exists (simple check in localStorage)
    if (typeof window !== 'undefined') {
      const existingUsers = getAllUsersFromStorage();
      if (existingUsers.some((u) => u.email === email)) {
        return {
          success: false,
          error: 'Email already registered',
        };
      }
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      password, // Note: In production, this should be hashed!
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      plan: 'free',
      joined: new Date().toISOString(),
      scans: [],
    };

    // Save user (in production would save to database)
    if (typeof window !== 'undefined') {
      const allUsers = getAllUsersFromStorage();
      allUsers.push(newUser);
      localStorage.setItem('resumeiq_all_users', JSON.stringify(allUsers));

      // Set current session
      localStorage.setItem(SESSION_KEY, newUser.id);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    }

    return {
      success: true,
      user: newUser,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Signup failed. Please try again.',
    };
  }
};

/**
 * Mock login function
 * Checks credentials and sets session in localStorage
 */
export const login = (email: string, password: string): AuthResponse => {
  try {
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required',
      };
    }

    // Check mock credentials first
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_KEY, MOCK_USER.id);
        localStorage.setItem(USER_KEY, JSON.stringify(MOCK_USER));
      }
      return {
        success: true,
        user: MOCK_USER,
      };
    }

    // Check registered users
    if (typeof window !== 'undefined') {
      const allUsers = getAllUsersFromStorage();
      const user = allUsers.find((u) => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem(SESSION_KEY, user.id);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return {
          success: true,
          user,
        };
      }
    }

    return {
      success: false,
      error: 'Invalid email or password',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Login failed. Please try again.',
    };
  }
};

/**
 * Get current user from session
 */
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;

  try {
    const userStr = localStorage.getItem(USER_KEY);
    const sessionId = localStorage.getItem(SESSION_KEY);

    if (userStr && sessionId) {
      const user = JSON.parse(userStr) as User;
      // Verify session is valid
      if (user.id === sessionId) {
        return user;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Logout user
 */
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

/**
 * Update user profile
 */
export const updateUserProfile = (updates: Partial<User>): AuthResponse => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: 'User not authenticated',
      };
    }

    const updatedUser: User = {
      ...currentUser,
      ...updates,
      id: currentUser.id, // Prevent ID changes
      email: currentUser.email, // Prevent email changes
      password: currentUser.password, // Prevent password changes here
      joined: currentUser.joined, // Prevent joined date changes
    };

    if (typeof window !== 'undefined') {
      // Update in all users list
      const allUsers = getAllUsersFromStorage();
      const userIndex = allUsers.findIndex((u) => u.id === currentUser.id);
      if (userIndex !== -1) {
        allUsers[userIndex] = updatedUser;
        localStorage.setItem('resumeiq_all_users', JSON.stringify(allUsers));
      }

      // Update current session
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update profile',
    };
  }
};

/**
 * Helper: Get all users from storage (for signup verification)
 */
const getAllUsersFromStorage = (): User[] => {
  if (typeof window === 'undefined') return [];

  try {
    const usersStr = localStorage.getItem('resumeiq_all_users');
    return usersStr ? JSON.parse(usersStr) : [];
  } catch {
    return [];
  }
};

/**
 * Initialize demo user if no users exist
 */
export const initializeDemoUser = (): void => {
  if (typeof window === 'undefined') return;

  try {
    const existingUsers = getAllUsersFromStorage();
    if (existingUsers.length === 0) {
      localStorage.setItem('resumeiq_all_users', JSON.stringify([MOCK_USER]));
    }
  } catch (error) {
    console.error('Failed to initialize demo user:', error);
  }
};
