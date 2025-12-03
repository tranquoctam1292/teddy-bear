// NextAuth v5 Configuration with bcrypt password hashing
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getCollections } from './db';

// Validate required environment variables
if (!process.env.AUTH_SECRET) {
  throw new Error('AUTH_SECRET is required. Generate with: openssl rand -base64 32');
}

if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  console.warn('⚠️  ADMIN_EMAIL and ADMIN_PASSWORD not set. Admin login will not work.');
}

/**
 * Initialize admin user in database if not exists
 * This should be run once on first setup
 */
async function initializeAdminUser() {
  try {
    const { users } = await getCollections();
    const adminEmail = process.env.ADMIN_EMAIL;
    
    if (!adminEmail) {
      return; // Skip if no admin email configured
    }

    // Check if admin user exists
    const existingAdmin = await users.findOne({ email: adminEmail, role: 'admin' });
    
    if (!existingAdmin) {
      // Create admin user with hashed password
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'admin123',
        10
      );

      await users.insertOne({
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log('✅ Admin user created in database');
    }
  } catch (error) {
    // If MongoDB is not connected, skip initialization
    if (error instanceof Error && error.message.includes('MongoDB URI')) {
      console.warn('⚠️  MongoDB not connected. Skipping admin user initialization.');
      return;
    }
    console.error('Error initializing admin user:', error);
  }
}

// Initialize admin user on module load (only if MongoDB is available)
if (process.env.MONGODB_URI) {
  initializeAdminUser().catch(console.error);
}

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

        try {
          // Try to get user from database
          const { users } = await getCollections();
          const user = await users.findOne({ email: credentials.email });

          if (user) {
            // Verify password with bcrypt
            const isValid = await bcrypt.compare(
              credentials.password as string,
              user.password as string
            );

            if (isValid) {
              return {
                id: user._id?.toString() || user.id || '1',
                email: user.email,
                name: user.name || 'Admin',
                role: user.role || 'admin',
              };
            }
          }

          // Fallback: Check against environment variables (for backward compatibility)
          // This allows login even if database is not set up yet
          const adminEmail = process.env.ADMIN_EMAIL || 'admin@emotionalhouse.vn';
          const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

          if (credentials.email === adminEmail) {
            // For first-time setup, compare plain password
            // After first login, password should be in database
            if (credentials.password === adminPassword) {
              // If password matches, hash it and save to database
              try {
                const { users } = await getCollections();
                const hashedPassword = await bcrypt.hash(adminPassword, 10);
                await users.updateOne(
                  { email: adminEmail },
                  {
                    $set: {
                      email: adminEmail,
                      password: hashedPassword,
                      name: 'Admin',
                      role: 'admin',
                      updatedAt: new Date(),
                    },
                    $setOnInsert: {
                      createdAt: new Date(),
                    },
                  },
                  { upsert: true }
                );
              } catch (dbError) {
                // If database fails, still allow login for backward compatibility
                console.warn('Could not save password to database:', dbError);
              }

              return {
                id: '1',
                email: adminEmail,
                name: 'Admin',
                role: 'admin',
              };
            }
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          // If database is not available, fall back to env vars
          const adminEmail = process.env.ADMIN_EMAIL || 'admin@emotionalhouse.vn';
          const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

          if (
            credentials.email === adminEmail &&
            credentials.password === adminPassword
          ) {
            return {
              id: '1',
              email: adminEmail,
              name: 'Admin',
              role: 'admin',
            };
          }

          return null;
        }
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
  secret: process.env.AUTH_SECRET,
});
