// Example page showing Keyword Data Source Badges
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import KeywordDataSourceBadge, { 
  KeywordDataSources, 
  InlineSourceBadge 
} from '@/components/admin/seo/KeywordDataSourceBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/admin/ui/table';

export const metadata: Metadata = {
  title: 'Keyword Data Sources Example | Admin',
  description: 'Example of keyword data source indicators',
};

export default function KeywordBadgesExamplePage() {
  // Example keyword data
  const keywords = [
    { 
      keyword: 'gấu bông teddy', 
      volume: 'High (10K+)', 
      difficulty: 75, 
      source: 'serpapi' as const, 
      confidence: 'high' as const 
    },
    { 
      keyword: 'mua gấu bông online', 
      volume: 'Medium (5K-10K)', 
      difficulty: 62, 
      source: 'internal' as const, 
      confidence: 'medium' as const 
    },
    { 
      keyword: 'gấu bông giá rẻ tphcm', 
      volume: 'Low (100-1K)', 
      difficulty: 45, 
      source: 'estimated' as const, 
      confidence: 'low' as const 
    },
    { 
      keyword: 'teddy bear vietnam', 
      volume: 'Medium (1K-5K)', 
      difficulty: 55, 
      source: 'gsc' as const, 
      confidence: 'high' as const 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Keyword Data Sources</h1>
        <p className="text-muted-foreground mt-2">
          Examples of data source indicators and confidence levels
        </p>
      </div>

      {/* Badge Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Variants</CardTitle>
          <CardDescription>
            Different styles for displaying data sources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Default Variant */}
          <div>
            <h3 className="text-sm font-medium mb-3">Default Variant (with confidence)</h3>
            <div className="space-y-3">
              <KeywordDataSourceBadge source="serpapi" confidence="high" />
              <KeywordDataSourceBadge source="dataforseo" confidence="high" />
              <KeywordDataSourceBadge source="internal" confidence="medium" />
              <KeywordDataSourceBadge source="gsc" confidence="high" />
              <KeywordDataSourceBadge source="estimated" confidence="low" />
            </div>
          </div>

          {/* Compact Variant */}
          <div>
            <h3 className="text-sm font-medium mb-3">Compact Variant</h3>
            <div className="flex flex-wrap gap-2">
              <KeywordDataSourceBadge source="serpapi" confidence="high" variant="compact" />
              <KeywordDataSourceBadge source="dataforseo" confidence="high" variant="compact" />
              <KeywordDataSourceBadge source="internal" confidence="medium" variant="compact" />
              <KeywordDataSourceBadge source="gsc" confidence="high" variant="compact" />
              <KeywordDataSourceBadge source="estimated" confidence="low" variant="compact" />
            </div>
          </div>

          {/* Multiple Sources */}
          <div>
            <h3 className="text-sm font-medium mb-3">Multiple Sources</h3>
            <KeywordDataSources
              sources={[
                { source: 'serpapi', confidence: 'high' },
                { source: 'internal', confidence: 'medium' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Keyword Table with Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Keywords with Data Sources</CardTitle>
          <CardDescription>
            Example of keywords table with data source indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords.map((kw, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{kw.keyword}</TableCell>
                  <TableCell>{kw.volume}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            kw.difficulty > 70
                              ? 'bg-red-500'
                              : kw.difficulty > 40
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${kw.difficulty}%` }}
                        />
                      </div>
                      <span className="text-sm">{kw.difficulty}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <KeywordDataSourceBadge
                      source={kw.source}
                      confidence={kw.confidence}
                      variant="compact"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Inline Badges Example */}
      <Card>
        <CardHeader>
          <CardTitle>Inline Source Indicators</CardTitle>
          <CardDescription>
            Compact emoji-based indicators for tight spaces
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              gấu bông teddy <InlineSourceBadge source="serpapi" confidence="high" /> - High confidence
            </p>
            <p>
              mua gấu bông online <InlineSourceBadge source="internal" confidence="medium" /> - Medium confidence
            </p>
            <p>
              gấu bông giá rẻ <InlineSourceBadge source="estimated" confidence="low" /> - Low confidence
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Data Source Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2 text-sm">Data Sources</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">🌐</span>
                  <span><strong>SerpAPI:</strong> Real SERP data from Google</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">📊</span>
                  <span><strong>DataForSEO:</strong> Professional SEO API data</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-600">📈</span>
                  <span><strong>Internal:</strong> Calculated from GSC data</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  <span><strong>GSC:</strong> Google Search Console data</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">≈</span>
                  <span><strong>Estimated:</strong> Basic estimation</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-sm">Confidence Levels</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">●</span>
                  <span><strong>High:</strong> Verified from reliable sources</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-600">●</span>
                  <span><strong>Medium:</strong> Calculated with good data</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">●</span>
                  <span><strong>Low:</strong> Estimated or limited data</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

