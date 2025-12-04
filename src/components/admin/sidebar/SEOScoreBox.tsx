'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Target } from 'lucide-react';
import SEOScoreCircle from '../seo/SEOScoreCircle';

interface SEOScoreBoxProps {
  data: {
    keyword: string;
    title: string;
    description: string;
    content: string;
    slug: string;
    featuredImage?: string;
  };
  onScoreChange?: (score: number) => void;
}

export default function SEOScoreBox({
  data,
  onScoreChange,
}: SEOScoreBoxProps) {
  return (
    <SEOScoreCircle data={data} onScoreChange={onScoreChange} />
  );
}



