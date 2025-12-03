/**
 * Robots.txt Tester Component
 * 
 * Test tool for validating robots.txt against different user agents and URLs
 */

'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Label } from '@/components/admin/ui/label';
import { Select } from '@/components/admin/ui/select';
import { Alert, AlertDescription } from '@/components/admin/ui/alert';
import { CheckCircle2, XCircle, TestTube, Loader2 } from 'lucide-react';
import { parseRobotsTxt } from '@/lib/seo/robots-generator';

interface RobotsTesterProps {
  content: string;
}

interface TestResult {
  allowed: boolean;
  reason: string;
  matchedRule?: {
    userAgent: string;
    directive: 'allow' | 'disallow';
    path: string;
  };
}

export default function RobotsTester({ content }: RobotsTesterProps) {
  const [userAgent, setUserAgent] = useState('*');
  const [testUrl, setTestUrl] = useState('/');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const commonUserAgents = [
    { value: '*', label: '* (Tất cả)' },
    { value: 'Googlebot', label: 'Googlebot' },
    { value: 'Googlebot-Image', label: 'Googlebot-Image' },
    { value: 'Googlebot-Mobile', label: 'Googlebot-Mobile' },
    { value: 'Bingbot', label: 'Bingbot' },
    { value: 'Slurp', label: 'Yahoo Slurp' },
    { value: 'DuckDuckBot', label: 'DuckDuckBot' },
    { value: 'Baiduspider', label: 'Baiduspider' },
    { value: 'YandexBot', label: 'YandexBot' },
    { value: 'facebookexternalhit', label: 'Facebook Bot' },
    { value: 'Twitterbot', label: 'Twitter Bot' },
  ];

  const testRobotsTxt = () => {
    if (!content || !testUrl) {
      return;
    }

    setIsTesting(true);
    
    try {
      // Parse robots.txt
      const config = parseRobotsTxt(content);
      
      // Find matching rules for the user agent
      const matchingRules = config.rules.filter(
        rule => rule.userAgent === userAgent || rule.userAgent === '*'
      );

      // Sort rules: specific user agents first, then wildcard
      matchingRules.sort((a, b) => {
        if (a.userAgent === '*') return 1;
        if (b.userAgent === '*') return -1;
        return 0;
      });

      // Normalize test URL
      const normalizedUrl = testUrl.startsWith('/') ? testUrl : `/${testUrl}`;
      
      // Check if URL is allowed or disallowed
      let allowed: boolean | null = null;
      let matchedRule: TestResult['matchedRule'] | undefined;

      for (const rule of matchingRules) {
        // Check disallow rules first (more specific)
        if (rule.disallow && rule.disallow.length > 0) {
          for (const disallowPath of rule.disallow) {
            if (matchesPath(normalizedUrl, disallowPath)) {
              allowed = false;
              matchedRule = {
                userAgent: rule.userAgent,
                directive: 'disallow',
                path: disallowPath,
              };
              break;
            }
          }
        }

        // Check allow rules
        if (rule.allow && rule.allow.length > 0) {
          for (const allowPath of rule.allow) {
            if (matchesPath(normalizedUrl, allowPath)) {
              allowed = true;
              matchedRule = {
                userAgent: rule.userAgent,
                directive: 'allow',
                path: allowPath,
              };
              break;
            }
          }
        }
      }

      // Default: if no rule matches, allow
      if (allowed === null) {
        allowed = true;
      }

      setTestResult({
        allowed,
        reason: allowed
          ? 'URL được phép crawl'
          : 'URL bị chặn crawl',
        matchedRule,
      });
    } catch (error) {
      console.error('Error testing robots.txt:', error);
      setTestResult({
        allowed: false,
        reason: 'Lỗi khi phân tích robots.txt',
      });
    } finally {
      setIsTesting(false);
    }
  };

  /**
   * Check if a URL matches a robots.txt path pattern
   */
  const matchesPath = (url: string, pattern: string): boolean => {
    // Empty pattern matches everything
    if (!pattern || pattern === '') {
      return true;
    }

    // Normalize pattern
    const normalizedPattern = pattern.startsWith('/') ? pattern : `/${pattern}`;

    // Exact match
    if (url === normalizedPattern) {
      return true;
    }

    // Prefix match (e.g., /admin/ matches /admin/anything)
    if (url.startsWith(normalizedPattern)) {
      return true;
    }

    // Wildcard matching (simple implementation)
    const regexPattern = normalizedPattern
      .replace(/\*/g, '.*')
      .replace(/\$/g, '$');
    
    try {
      const regex = new RegExp(`^${regexPattern}`);
      return regex.test(url);
    } catch {
      return false;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Robots.txt Tester
        </CardTitle>
        <CardDescription>
          Kiểm tra xem một URL có được phép crawl bởi user agent cụ thể không
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="user-agent">User Agent</Label>
            <Select
              id="user-agent"
              value={userAgent}
              onChange={(e) => setUserAgent(e.target.value)}
            >
              {commonUserAgents.map((agent) => (
                <option key={agent.value} value={agent.value}>
                  {agent.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="test-url">URL để test</Label>
            <Input
              id="test-url"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder="/products/example"
            />
          </div>
        </div>

        <Button
          onClick={testRobotsTxt}
          disabled={!content || !testUrl || isTesting}
          className="w-full"
        >
          {isTesting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang kiểm tra...
            </>
          ) : (
            <>
              <TestTube className="h-4 w-4 mr-2" />
              Kiểm tra
            </>
          )}
        </Button>

        {testResult && (
          <Alert
            variant={testResult.allowed ? 'default' : 'destructive'}
            className={testResult.allowed ? 'border-green-200 bg-green-50' : ''}
          >
            <div className="flex items-start gap-2">
              {testResult.allowed ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <AlertDescription
                  className={testResult.allowed ? 'text-green-800' : 'text-red-800'}
                >
                  <div className="font-semibold mb-1">{testResult.reason}</div>
                  {testResult.matchedRule && (
                    <div className="text-sm mt-2">
                      <p>
                        <span className="font-medium">Rule khớp:</span>{' '}
                        <code className="bg-gray-100 px-1 py-0.5 rounded">
                          {testResult.matchedRule.directive === 'allow' ? 'Allow' : 'Disallow'}: {testResult.matchedRule.path}
                        </code>
                      </p>
                      <p className="mt-1">
                        <span className="font-medium">User-agent:</span>{' '}
                        <code className="bg-gray-100 px-1 py-0.5 rounded">
                          {testResult.matchedRule.userAgent}
                        </code>
                      </p>
                    </div>
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

