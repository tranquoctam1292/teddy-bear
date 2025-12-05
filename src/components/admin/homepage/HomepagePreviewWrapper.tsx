// Server Component Wrapper for HomepagePreview
// This wrapper allows passing Server Component (HomepagePreviewContent) 
// to Client Component (HomepagePreview) using Component Composition pattern
import { HomepagePreview } from './HomepagePreview';
import { HomepagePreviewContent } from './HomepagePreviewContent';

interface HomepagePreviewWrapperProps {
  config: any;
}

export function HomepagePreviewWrapper({ config }: HomepagePreviewWrapperProps) {
  return (
    <HomepagePreview config={config}>
      <HomepagePreviewContent config={config} />
    </HomepagePreview>
  );
}

