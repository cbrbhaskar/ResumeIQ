/**
 * Implementation Guide: Using Mock Auth & Database
 * Quick reference for integrating with auth system
 */

/* ============================================
   1. SETUP: Add AuthProvider to Root Layout
   ============================================ */

// app/layout.tsx
import { AuthProvider } from '@/components/providers/auth-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

/* ============================================
   2. LOGIN/SIGNUP FORMS: Use Auth Hook
   ============================================ */

'use client';
import { useAuthContext } from '@/components/providers/auth-provider';

export function LoginForm() {
  const { login, error, user } = useAuthContext();

  const handleSubmit = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      // Navigate to dashboard
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      handleSubmit(fd.get('email') as string, fd.get('password') as string);
    }}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}

/* ============================================
   3. PROTECTED ROUTES: Check Auth State
   ============================================ */

'use client';
import { useAuthContext } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';

export function ProtectedPage() {
  const { user, loading, isAuthenticated } = useAuthContext();
  const router = useRouter();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <p>Plan: {user?.plan}</p>
    </div>
  );
}

/* ============================================
   4. SCANS: Create & Manage Scans
   ============================================ */

'use client';
import { useScans } from '@/hooks/use-scans';
import { useAuthContext } from '@/components/providers/auth-provider';

export function ScanManager() {
  const { scans, createScan, deleteScan, loading } = useScans();
  const { user } = useAuthContext();

  const handleNewScan = () => {
    const scan = createScan(
      'Senior Software Engineer',
      'Job description here...',
      'my_resume.pdf'
    );
    if (scan) {
      console.log('Scan created:', scan);
    }
  };

  if (loading) return <div>Loading scans...</div>;

  return (
    <div>
      <button onClick={handleNewScan}>New Scan</button>
      <div>
        {scans.map((scan) => (
          <div key={scan.id}>
            <h3>{scan.job_title}</h3>
            <p>Score: {scan.ats_score}</p>
            <p>Status: {scan.status}</p>
            <button onClick={() => deleteScan(scan.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   5. DIRECT AUTH FUNCTIONS: Low-Level Access
   ============================================ */

import {
  login,
  signup,
  logout,
  getCurrentUser,
  isAuthenticated,
  updateUserProfile,
} from '@/lib/auth';

// Use these for non-component contexts (API routes, utils, etc)
const result = login('test@example.com', 'password123');
if (result.success) {
  const user = getCurrentUser();
  console.log('Logged in:', user);
}

// Signup
const signupResult = signup('newuser@example.com', 'password', 'John Doe');
if (signupResult.success) {
  console.log('New user created:', signupResult.user);
}

// Update profile
updateUserProfile({ name: 'Jane Doe' });

/* ============================================
   6. MOCK DATA: Direct Database Access
   ============================================ */

import {
  getUserScans,
  addScan,
  deleteScan,
  getUserResumes,
  addResume,
  getMockDataStats,
  initializeMockData,
} from '@/lib/mock-data';

// Initialize on startup
initializeMockData();

// Get user's scans
const scans = getUserScans('user_test_001');

// Create new scan
const newScan = addScan(
  'user_123',
  'Software Engineer',
  'We are looking for...',
  'resume.pdf'
);

// Get stats
const stats = getMockDataStats();
console.log('Total scans:', stats.totalScans);

/* ============================================
   7. TEST ACCOUNT FOR DEVELOPMENT
   ============================================ */

Email:    test@example.com
Password: password123

Or create new account via signup form.

/* ============================================
   8. ENVIRONMENT VARIABLES
   ============================================ */

NEXT_PUBLIC_MOCK_MODE=true
NEXT_PUBLIC_MOCK_USER_EMAIL=test@example.com
NEXT_PUBLIC_MOCK_USER_PASSWORD=password123

/* ============================================
   9. FILE STRUCTURE
   ============================================ */

lib/
  ├── auth.ts                    # Authentication functions
  ├── mock-data.ts              # In-memory data storage
  └── types.ts                  # TypeScript interfaces

hooks/
  ├── use-auth.ts               # Auth hook (deprecated, use context)
  └── use-scans.ts              # Scans management hook

components/providers/
  └── auth-provider.tsx         # Auth context provider

app/api/auth/
  └── route.ts                  # Auth API endpoints

/* ============================================
   10. MIGRATION NOTES FOR FUTURE
   ============================================ */

When moving to real backend (Hostinger + Supabase):

1. Keep type definitions in `/lib/types.ts`
2. Move auth functions to Supabase Auth library
3. Replace localStorage with Supabase session management
4. Replace in-memory storage with Supabase data
5. Update API routes to use Supabase client
6. KeepProviders/Hooks (same interface)

The abstraction layer ensures minimal changes needed in components.
