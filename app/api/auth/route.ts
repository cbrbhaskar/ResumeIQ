/**
 * Authentication API Routes
 * Handles signup, login, logout, and getCurrentUser endpoints
 * Using mock data instead of Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { signup, login, logout, getCurrentUser, updateUserProfile } from '@/lib/auth';
import { User } from '@/lib/types';

/**
 * POST /api/auth - Main auth endpoint
 * Handles: signup, login, logout, getCurrentUser
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    // Signup action
    if (action === 'signup') {
      if (!email || !password || !name) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const result = signup(email, password, name);
      return NextResponse.json(result);
    }

    // Login action
    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: 'Email and password required' },
          { status: 400 }
        );
      }

      const result = login(email, password);
      return NextResponse.json(result);
    }

    // Logout action
    if (action === 'logout') {
      logout();
      return NextResponse.json({ success: true });
    }

    // Get current user
    if (action === 'getCurrentUser') {
      const user = getCurrentUser();
      if (user) {
        return NextResponse.json({ success: true, user });
      } else {
        return NextResponse.json(
          { success: false, error: 'Not authenticated' },
          { status: 401 }
        );
      }
    }

    // Update profile
    if (action === 'updateProfile') {
      const updates = body.updates as Partial<User>;
      const result = updateUserProfile(updates);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS endpoint for CORS
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
