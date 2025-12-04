// Public Homepage - Uses Homepage Configuration System
import { Metadata } from 'next';
import { getActiveHomepageConfig } from '../api/homepage/route';
import { HomepageRenderer } from '@/components/homepage/HomepageRenderer';
import {
  generateHomepageMetadata,
  generateHomepageSchema,
} from '@/components/homepage/HomepageSEO';
import { DefaultHomepage } from '@/components/homepage/DefaultHomepage';
import JsonLd from '@/components/seo/JsonLd';
import { HomepageAnalytics } from '@/components/homepage/HomepageAnalytics';

// ISR: Revalidate every hour
export const revalidate = 3600;

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const config = await getActiveHomepageConfig();

  if (!config) {
    return {
      title: 'The Emotional House - Gấu Bông Đầy Cảm Xúc',
      description: 'Mỗi chú gấu bông là một câu chuyện, một kỷ niệm đẹp. Tìm người bạn đồng hành hoàn hảo cho bạn và người thân yêu.',
    };
  }

  return generateHomepageMetadata(config);
}

export default async function HomePage() {
  // Fetch active homepage configuration
  const config = await getActiveHomepageConfig();

  // If no config, show default homepage
  if (!config) {
    return <DefaultHomepage />;
  }

  // Generate schema markup
  const schema = generateHomepageSchema(config);

  return (
    <>
      {/* SEO: Structured Data */}
      <JsonLd data={schema} />

      {/* Dynamic Homepage Renderer */}
      <HomepageRenderer config={config} />

      {/* Analytics */}
      <HomepageAnalytics config={config} />
    </>
  );
}

