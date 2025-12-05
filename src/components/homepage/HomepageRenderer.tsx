// Homepage Renderer - Renders sections from config
// NOTE: This is a Server Component but doesn't need 'server-only' directive
// because it doesn't directly import db.ts. The section components that use db.ts
// have their own 'server-only' directives.
import { HomepageConfig, HomepageSection } from '@/lib/types/homepage';
import { getSectionComponent } from './sections';
import { cn } from '@/lib/utils';

interface HomepageRendererProps {
  config: HomepageConfig;
  isPreview?: boolean;
}

export async function HomepageRenderer({ config, isPreview }: HomepageRendererProps) {
  // Get visible sections
  const visibleSections = (config.sections || [])
    .filter((section) => section.enabled)
    .filter((section) => isSectionVisible(section))
    .sort((a, b) => a.order - b.order);

  if (visibleSections.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-muted-foreground">
          No sections configured
        </h2>
        <p className="text-muted-foreground mt-2">
          {isPreview
            ? 'Add sections using the Section Builder'
            : 'This homepage has no sections yet'}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'homepage',
        config.settings?.layout && `layout-${config.settings.layout}`
      )}
      style={{
        backgroundColor: config.settings?.backgroundColor,
      }}
    >
      {visibleSections.map((section) => (
        <SectionWrapper key={section.id} section={section} isPreview={isPreview} />
      ))}
    </div>
  );
}

// Section Wrapper Component (async to support lazy-loaded Server Components)
async function SectionWrapper({
  section,
  isPreview,
}: {
  section: HomepageSection;
  isPreview?: boolean;
}) {
  const Component = await getSectionComponent(section.type);

  if (!Component) {
    console.warn(`Unknown section type: ${section.type}`);
    return null;
  }

  return (
    <section
      id={section.id}
      className={cn(
        'homepage-section',
        section.styles?.customClass
      )}
      style={{
        backgroundColor: section.layout.backgroundColor,
        backgroundImage: section.layout.backgroundImage
          ? `url(${section.layout.backgroundImage})`
          : undefined,
        paddingTop: section.layout.padding?.top || 48,
        paddingBottom: section.layout.padding?.bottom || 48,
        paddingLeft: section.layout.padding?.left || 16,
        paddingRight: section.layout.padding?.right || 16,
      }}
    >
      <Component
        section={section}
        content={section.content}
        layout={section.layout}
        isPreview={isPreview}
      />
    </section>
  );
}

// Check if section should be visible based on visibility rules
function isSectionVisible(section: HomepageSection): boolean {
  if (!section.visibility) return true;

  const now = new Date();

  // Check date range
  if (section.visibility.startDate && new Date(section.visibility.startDate) > now) {
    return false;
  }

  if (section.visibility.endDate && new Date(section.visibility.endDate) < now) {
    return false;
  }

  // Check device (in preview mode, show all devices)
  // In production, this would be handled by media queries or user agent detection

  return true;
}

