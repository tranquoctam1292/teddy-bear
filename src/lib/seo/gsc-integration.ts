/**
 * Google Search Console Integration
 * Fetches data from Google Search Console API
 */

export interface GSCQueryData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number; // Click-through rate
  position: number; // Average position
  date: string;
}

export interface GSCPageData {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  date: string;
}

export interface GSCCountryData {
  country: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/**
 * Google Search Console API Client
 */
export class GSCClient {
  private accessToken: string | null = null;
  private siteUrl: string;

  constructor(siteUrl: string) {
    this.siteUrl = siteUrl;
  }

  /**
   * Set access token (from OAuth flow)
   */
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  /**
   * Fetch search analytics data
   */
  async getSearchAnalytics(options: {
    startDate: string;
    endDate: string;
    dimensions?: ('query' | 'page' | 'country' | 'device')[];
    rowLimit?: number;
  }): Promise<any> {
    if (!this.accessToken) {
      throw new Error('GSC access token not set');
    }

    try {
      const { startDate, endDate, dimensions = ['query'], rowLimit = 1000 } = options;
      
      // Encode site URL
      const encodedSiteUrl = encodeURIComponent(this.siteUrl);

      const response = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startDate,
            endDate,
            dimensions,
            rowLimit,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'GSC API error');
      }

      const data = await response.json();
      return data.rows || [];
    } catch (error) {
      console.error('Error fetching GSC data:', error);
      throw error;
    }
  }

  /**
   * Get top queries
   */
  async getTopQueries(startDate: string, endDate: string, limit: number = 100): Promise<GSCQueryData[]> {
    const rows = await this.getSearchAnalytics({
      startDate,
      endDate,
      dimensions: ['query'],
      rowLimit: limit,
    });

    return rows.map((row: any) => ({
      query: row.keys[0],
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0,
      date: endDate, // Use end date as reference
    }));
  }

  /**
   * Get top pages
   */
  async getTopPages(startDate: string, endDate: string, limit: number = 100): Promise<GSCPageData[]> {
    const rows = await this.getSearchAnalytics({
      startDate,
      endDate,
      dimensions: ['page'],
      rowLimit: limit,
    });

    return rows.map((row: any) => ({
      page: row.keys[0],
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0,
      date: endDate,
    }));
  }

  /**
   * Get data by country
   */
  async getDataByCountry(startDate: string, endDate: string): Promise<GSCCountryData[]> {
    const rows = await this.getSearchAnalytics({
      startDate,
      endDate,
      dimensions: ['country'],
      rowLimit: 100,
    });

    return rows.map((row: any) => ({
      country: row.keys[0],
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0,
    }));
  }
}

/**
 * Get singleton GSC client instance
 */
let gscClient: GSCClient | null = null;

export function getGSCClient(): GSCClient | null {
  const siteUrl = process.env.GSC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    console.warn('⚠️  GSC_SITE_URL not configured. Google Search Console integration disabled.');
    return null;
  }

  if (!gscClient) {
    gscClient = new GSCClient(siteUrl);
    
    // Set access token if available
    const accessToken = process.env.GSC_ACCESS_TOKEN;
    if (accessToken) {
      gscClient.setAccessToken(accessToken);
    }
  }

  return gscClient;
}



