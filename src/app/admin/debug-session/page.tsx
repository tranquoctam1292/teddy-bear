// Debug Session Page - Check if session is working
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DebugSessionPage() {
  // Get session
  let session;
  try {
    session = await auth();
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">❌ Auth Error</h1>
        <pre className="bg-red-50 p-4 rounded">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    );
  }

  // Get cookies
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  // If not logged in, redirect to login
  if (!session?.user) {
    redirect('/admin/login?callbackUrl=/admin/debug-session');
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">🔍 Session Debug</h1>

      {/* Session Info */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Session Info</h2>
        <pre className="bg-gray-50 p-4 rounded overflow-auto">
          {JSON.stringify(
            {
              hasSession: !!session,
              hasUser: !!session?.user,
              user: session?.user
                ? {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.name,
                    role: session.user.role,
                  }
                : null,
            },
            null,
            2
          )}
        </pre>
      </div>

      {/* Cookies Info */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Cookies Info</h2>
        <div className="space-y-2">
          <p>
            <strong>Total Cookies:</strong> {allCookies.length}
          </p>
          <div className="space-y-2">
            {allCookies.map((cookie, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded">
                <p>
                  <strong>Name:</strong> {cookie.name}
                </p>
                <p>
                  <strong>Value:</strong>{' '}
                  {cookie.value.length > 50
                    ? `${cookie.value.substring(0, 50)}...`
                    : cookie.value}
                </p>
                <p>
                  <strong>Is Auth Cookie:</strong>{' '}
                  {cookie.name.includes('auth') ||
                  cookie.name.includes('session') ||
                  cookie.name.includes('next-auth')
                    ? '✅ YES'
                    : '❌ NO'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Environment Check */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
        <div className="space-y-2">
          <p>
            <strong>AUTH_SECRET:</strong>{' '}
            {process.env.AUTH_SECRET
              ? `✅ Set (${process.env.AUTH_SECRET.length} chars)`
              : '❌ Not set'}
          </p>
          <p>
            <strong>NEXT_PUBLIC_SITE_URL:</strong>{' '}
            {process.env.NEXT_PUBLIC_SITE_URL || '❌ Not set'}
          </p>
          <p>
            <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <a
          href="/admin/homepage/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Homepage Creation
        </a>
        <a
          href="/admin/dashboard"
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}

