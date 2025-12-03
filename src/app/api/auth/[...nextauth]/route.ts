// NextAuth API Route Handler
import { handlers } from '@/lib/auth';

// Use Node.js runtime (not edge) to support bcryptjs and crypto module
export const runtime = 'nodejs';

export const { GET, POST } = handlers;



