// Public Homepage - Optimized Version (Removed unnecessary sections)
// Server Component assembling all homepage sections
import { Metadata } from 'next';
import { HeroSlider } from '@/components/homepage/sections/hero-slider';
import { CategoryShowcase } from '@/components/homepage/sections/category-showcase';
import { FeaturesList } from '@/components/homepage/sections/features-list';
import { FeaturedProducts } from '@/components/homepage/sections/FeaturedProducts';
import { GiftGuide } from '@/components/homepage/sections/gift-guide';
import { AgeRecommendation } from '@/components/homepage/sections/age-recommendation';
import { BlogPosts } from '@/components/homepage/sections/blog-posts';
import { Newsletter } from '@/components/homepage/sections/Newsletter';
import { MOCK_PRODUCTS, NEWSLETTER_CONTENT, HERO_SLIDES } from '@/lib/mock-data';

// ISR: Revalidate every hour
export const revalidate = 3600;

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Teddy Shop - Gấu Bông Đầy Cảm Xúc',
    description:
      'Mỗi chú gấu bông là một câu chuyện, một kỷ niệm đẹp. Tìm người bạn đồng hành hoàn hảo cho bạn và người thân yêu.',
  };
}

export default async function HomePage() {
  return (
    <main className="flex flex-col gap-12 md:gap-20 lg:gap-28">
      {/* 1. Hero Section - Hero Slider (Emotional Storytelling) */}
      <HeroSlider
        content={{
          slides: HERO_SLIDES,
          autoplay: true,
          autoplayInterval: 5000,
          showDots: true,
          showArrows: true,
          transition: 'fade',
        }}
      />

      {/* 2. Category Showcase - Phase 7 */}
      <CategoryShowcase
        heading="Khám Phá Bộ Sưu Tập"
        subheading="Tìm người bạn đồng hành hoàn hảo cho bạn"
      />

      {/* 3. Trust Signals - Features List */}
      <FeaturesList
        heading="Tại sao chọn chúng tôi?"
        subheading="Cam kết mang đến trải nghiệm mua sắm tốt nhất"
        limit={4}
      />

      {/* 4. Best Sellers - Featured Products */}
      <FeaturedProducts
        content={{
          heading: 'Sản phẩm nổi bật',
          subheading: 'Khám phá bộ sưu tập đa dạng của chúng tôi',
          productSelection: 'manual',
          productIds: MOCK_PRODUCTS.slice(0, 8).map((p) => p.id),
          columns: 4,
          showPrice: true,
          showRating: true,
          showAddToCart: true,
          limit: 8,
          viewMoreButton: {
            text: 'Xem tất cả sản phẩm',
            link: '/products',
          },
        }}
      />

      {/* 5. Gift Guide - Phase 8 */}
      <GiftGuide
        heading="Tìm Quà Tặng Hoàn Hảo"
        subheading="Gợi ý quà tặng theo từng dịp đặc biệt"
      />

      {/* 6. Age Recommendation - Phase 9 */}
      <AgeRecommendation
        heading="Chọn Gấu Bông Theo Độ Tuổi"
        subheading="An toàn và phù hợp cho mọi lứa tuổi"
      />

      {/* 7. Content - Blog Posts */}
      <BlogPosts
        heading="Bài viết mới nhất"
        subheading="Khám phá những bài viết hữu ích về gấu bông và đồ chơi"
        limit={3}
        showViewAll={true}
        viewAllLink="/blog"
      />

      {/* 8. Retention - Newsletter */}
      <Newsletter content={NEWSLETTER_CONTENT} />

      {/* HIDDEN SECTIONS (Commented out for future use) */}
      {/* 
      {/* 7. Promotional - CTA Banner (Hidden - "Giảm giá lên đến 50%") */}
      {/* <CTABanner content={CTA_CONTENT} /> */}

      {/* 8. Urgency - Countdown Timer (Removed - Not suitable for teddy bears) */}
      {/* <CountdownTimer
        content={{
          targetDate: COUNTDOWN_TARGET.targetDate,
          heading: COUNTDOWN_TARGET.heading,
          description: COUNTDOWN_TARGET.description,
          buttonText: COUNTDOWN_TARGET.buttonText,
          buttonLink: COUNTDOWN_TARGET.buttonLink,
        }}
      /> */}

      {/* 9. Social Proof - Testimonials (Hidden - "Khách hàng nói gì về chúng tôi") */}
      {/* <Testimonials
        heading="Khách hàng nói gì về chúng tôi"
        subheading="Những đánh giá chân thực từ khách hàng đã mua sắm"
        limit={3}
      /> */}

      {/* 10. Video Showcase (Removed - Placeholder videos) */}
      {/* <VideoShowcase
        heading="Khám Phá Sản Phẩm"
        subheading="Xem gấu bông trong cuộc sống thực tế"
      /> */}
    </main>
  );
}
