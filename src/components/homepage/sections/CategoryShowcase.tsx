// Category Showcase Section Component
import Image from 'next/image';
import Link from 'next/link';
import { CategoryShowcaseContent } from '@/lib/types/homepage';
import { Card, CardContent } from '@/components/ui/card';

interface CategoryShowcaseProps {
  content: CategoryShowcaseContent;
  layout: any;
  isPreview?: boolean;
}

export function CategoryShowcase({
  content,
  layout,
  isPreview,
}: CategoryShowcaseProps) {
  if (content.categories.length === 0) {
    return (
      <div className="container py-12">
        <p className="text-center text-muted-foreground">
          No categories configured. Please add categories.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      {/* Header */}
      {(content.heading || content.subheading) && (
        <div className="mb-8 text-center">
          {content.heading && (
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {content.heading}
            </h2>
          )}
          {content.subheading && (
            <p className="mt-2 text-lg text-muted-foreground">
              {content.subheading}
            </p>
          )}
        </div>
      )}

      {/* Categories Grid */}
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: `repeat(${content.columns || 4}, minmax(0, 1fr))`,
        }}
      >
        {content.categories.map((category) => (
          <Link
            key={category.id}
            href={category.link}
            className="group"
          >
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <CardContent className="p-0">
                {/* Category Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>

                {/* Category Name */}
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold group-hover:text-primary">
                    {category.name}
                  </h3>
                  {content.showCount && (
                    <p className="text-sm text-muted-foreground">
                      View products →
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

