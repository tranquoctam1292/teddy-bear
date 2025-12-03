// NextAuth v5 Configuration
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// Admin credentials (in production, use environment variables and database)
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@emotionalhouse.vn',
  password: process.env.ADMIN_PASSWORD || 'admin123',
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Validate credentials
        if (
          credentials.email === ADMIN_CREDENTIALS.email &&
          credentials.password === ADMIN_CREDENTIALS.password
        ) {
          return {
            id: '1',
            email: ADMIN_CREDENTIALS.email,
            name: 'Admin',
            role: 'admin',
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET || 'your-secret-key-change-in-production',
});



