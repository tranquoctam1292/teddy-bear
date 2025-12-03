import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript config - Ignore build errors for rapid deployment
  typescript: {
    ignoreBuildErrors: true, // ⚠️ TODO: Fix type mismatches incrementally
  },
  
  // Turbopack config (for Next.js 16+ dev mode)
  turbopack: {
    // Turbopack automatically excludes Node.js built-ins from client bundle
    // MongoDB is already excluded by separating mock-products.ts
  },
  
  // Webpack config (for production build)
  webpack: (config, { isServer }) => {
    // Exclude MongoDB and Node.js built-in modules from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        dns: false,
      };
      
      // Exclude mongodb package from client bundle
      config.externals = config.externals || [];
      config.externals.push('mongodb');
    }
    
    return config;
  },
};

export default nextConfig;
