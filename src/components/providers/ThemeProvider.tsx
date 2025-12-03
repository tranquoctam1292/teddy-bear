'use client';

// Theme Provider Component
import { createContext, useContext, useEffect, useState } from 'react';
import type { AppearanceConfig } from '@/lib/schemas/appearance-settings';

interface ThemeContextType {
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  favicon?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Default values
const DEFAULT_CONFIG: AppearanceConfig = {
  id: 'default',
  theme: 'light',
  primaryColor: '#3B82F6',
  secondaryColor: '#8B5CF6',
  borderRadius: 'md',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppearanceConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mediaQuery: MediaQueryList | null = null;
    let cleanup: (() => void) | null = null;

    // Load appearance config from public API
    fetch('/api/appearance')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        if (data.config) {
          setConfig(data.config);
          cleanup = applyTheme(data.config);
        } else {
          cleanup = applyTheme(DEFAULT_CONFIG);
        }
      })
      .catch((error) => {
        console.error('Error loading appearance config:', error);
        // Use defaults
        cleanup = applyTheme(DEFAULT_CONFIG);
      })
      .finally(() => setIsLoading(false));

    // Cleanup on unmount
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const applyTheme = (config: AppearanceConfig): (() => void) | null => {
    const html = document.documentElement;
    const theme = config.theme || 'light';

    // Apply theme class
    if (theme === 'auto') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.classList.toggle('dark', prefersDark);

      // Listen to system preference changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        html.classList.toggle('dark', e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);

      // Return cleanup function
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      html.classList.toggle('dark', theme === 'dark');
    }

    // Apply CSS variables for colors
    if (config.primaryColor) {
      document.documentElement.style.setProperty('--color-primary', config.primaryColor);
    }
    if (config.secondaryColor) {
      document.documentElement.style.setProperty('--color-secondary', config.secondaryColor);
    }

    // Apply border radius
    if (config.borderRadius) {
      const radiusMap: Record<string, string> = {
        none: '0',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
      };
      document.documentElement.style.setProperty(
        '--border-radius',
        radiusMap[config.borderRadius] || '0.375rem'
      );
    }

    // Update favicon
    if (config.favicon) {
      updateFavicon(config.favicon);
    }

    return null;
  };

  const updateFavicon = (faviconUrl: string) => {
    // Remove existing favicon links
    const existingLinks = document.querySelectorAll("link[rel~='icon']");
    existingLinks.forEach((link) => link.remove());

    // Add new favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = faviconUrl;
    document.head.appendChild(link);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: config.theme,
        primaryColor: config.primaryColor,
        secondaryColor: config.secondaryColor,
        logo: config.logo,
        favicon: config.favicon,
        borderRadius: config.borderRadius,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

