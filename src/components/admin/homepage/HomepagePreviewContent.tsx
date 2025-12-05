// Server Component: Preview Content Renderer
import { HomepageRenderer } from '@/components/homepage/HomepageRenderer';

interface HomepagePreviewContentProps {
  config: any;
}

export async function HomepagePreviewContent({ config }: HomepagePreviewContentProps) {
  // This is a Server Component that can safely render async sections
  return <HomepageRenderer config={config} isPreview={true} />;
}

