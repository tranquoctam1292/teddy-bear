/**
 * Google Analytics Integration
 * Fetches traffic data from Google Analytics API for traffic correlation
 */

export interface GATrafficData {
  date: string;
  sessions: number;
  users: number;
  pageviews: number;
  bounceRate: number;
  avgSessionDuration: number;
  organicSessions: number;
  directSessions: number;
  referralSessions: number;
}

export interface GAPageData {
  pagePath: string;
  sessions: number;
  pageviews: number;
  avgTimeOnPage: number;
  bounceRate: number;
  organicSessions: number;
}

/**
 * Google Analytics API Client
 * Requires Google Analytics Data API credentials
 */
export class GoogleAnalyticsClient {
  private accessToken: string | null = null;
  private propertyId: string;

  constructor(propertyId: string) {
    this.propertyId = propertyId;
  }

  /**
   * Set access token (from OAuth flow or service account)
   */
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  /**
   * Fetch traffic data for a date range
   */
  async getTrafficData(startDate: string, endDate: string): Promise<GATrafficData[]> {
    if (!this.accessToken) {
      throw new Error('Google Analytics access token not set');
    }

    try {
      // Use Google Analytics Data API (GA4)
      const response = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${this.propertyId}:runReport`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dateRanges: [
              {
                startDate,
                endDate,
              },
            ],
            dimensions: [{ name: 'date' }],
            metrics: [
              { name: 'sessions' },
              { name: 'activeUsers' },
              { name: 'screenPageViews' },
              { name: 'bounceRate' },
              { name: 'averageSessionDuration' },
              { name: 'organicGoogleSearchSessions' },
              { name: 'directSessions' },
              { name: 'referralSessions' },
            ],
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch GA data');
      }

      const data = await response.json();
      
      // Transform GA4 response to our format
      return data.rows?.map((row: any) => {
        const dimensionValues = row.dimensionValues || [];
        const metricValues = row.metricValues || [];

        return {
          date: dimensionValues[0]?.value || '',
          sessions: parseInt(metricValues[0]?.value || '0'),
          users: parseInt(metricValues[1]?.value || '0'),
          pageviews: parseInt(metricValues[2]?.value || '0'),
          bounceRate: parseFloat(metricValues[3]?.value || '0'),
          avgSessionDuration: parseFloat(metricValues[4]?.value || '0'),
          organicSessions: parseInt(metricValues[5]?.value || '0'),
          directSessions: parseInt(metricValues[6]?.value || '0'),
          referralSessions: parseInt(metricValues[7]?.value || '0'),
        };
      }) || [];
    } catch (error) {
      console.error('Error fetching GA traffic data:', error);
      throw error;
    }
  }

  /**
   * Fetch page-specific data
   */
  async getPageData(startDate: string, endDate: string, pagePath?: string): Promise<GAPageData[]> {
    if (!this.accessToken) {
      throw new Error('Google Analytics access token not set');
    }

    try {
      const dimensions: any[] = [{ name: 'pagePath' }];
      const dimensionFilter: any = {};

      if (pagePath) {
        dimensionFilter.filter = {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'EXACT',
            value: pagePath,
          },
        };
      }

      const response = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${this.propertyId}:runReport`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dateRanges: [
              {
                startDate,
                endDate,
              },
            ],
            dimensions,
            metrics: [
              { name: 'sessions' },
              { name: 'screenPageViews' },
              { name: 'averageSessionDuration' },
              { name: 'bounceRate' },
              { name: 'organicGoogleSearchSessions' },
            ],
            ...(pagePath ? { dimensionFilter } : {}),
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch GA page data');
      }

      const data = await response.json();

      return data.rows?.map((row: any) => {
        const dimensionValues = row.dimensionValues || [];
        const metricValues = row.metricValues || [];

        return {
          pagePath: dimensionValues[0]?.value || '',
          sessions: parseInt(metricValues[0]?.value || '0'),
          pageviews: parseInt(metricValues[1]?.value || '0'),
          avgTimeOnPage: parseFloat(metricValues[2]?.value || '0'),
          bounceRate: parseFloat(metricValues[3]?.value || '0'),
          organicSessions: parseInt(metricValues[4]?.value || '0'),
        };
      }) || [];
    } catch (error) {
      console.error('Error fetching GA page data:', error);
      throw error;
    }
  }
}

/**
 * Get singleton GA client instance
 */
let gaClient: GoogleAnalyticsClient | null = null;

export function getGAClient(): GoogleAnalyticsClient | null {
  const propertyId = process.env.GA_PROPERTY_ID;
  if (!propertyId) {
    console.warn('⚠️  GA_PROPERTY_ID not configured. Google Analytics integration disabled.');
    return null;
  }

  if (!gaClient) {
    gaClient = new GoogleAnalyticsClient(propertyId);
    
    // Set access token if available
    const accessToken = process.env.GA_ACCESS_TOKEN;
    if (accessToken) {
      gaClient.setAccessToken(accessToken);
    }
  }

  return gaClient;
}


