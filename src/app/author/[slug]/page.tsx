// Public: Author Archive Page
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import AuthorBox from '@/components/blog/AuthorBox';
import { generateAuthorProfileSchema } from '@/lib/seo/author-schema';

// This would be replaced with actual API call
async function getAuthorBySlug(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/authors/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) return null;
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching author:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await getAuthorBySlug(params.slug);

  if (!data) {
    return {
      title: 'Author Not Found',
    };
  }

  const { author } = data;

  return {
    title: `${author.name}${author.credentials ? `, ${author.credentials}` : ''} - Author Profile`,
    description: author.metaDescription || author.bio,
    openGraph: {
      title: `${author.name} - Author Profile`,
      description: author.bio,
      type: 'profile',
      ...(author.avatar && {
        images: [
          {
            url: author.avatar,
            width: 400,
            height: 400,
            alt: author.name,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary',
      title: `${author.name} - Author Profile`,
      description: author.bio,
      ...(author.avatar && { images: [author.avatar] }),
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getAuthorBySlug(params.slug);

  if (!data) {
    notFound();
  }

  const { author, recentPosts } = data;

  // Generate Schema.org markup
  const schema = generateAuthorProfileSchema(author, author.postCount || 0);

  return (
    <>
      {/* Schema.org Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {author.avatar ? (
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    width={200}
                    height={200}
                    className="rounded-full border-4 border-white shadow-2xl"
                  />
                ) : (
                  <div className="w-50 h-50 rounded-full bg-white/20 border-4 border-white flex items-center justify-center shadow-2xl">
                    <span className="text-6xl font-bold">
                      {author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  {author.name}
                  {author.credentials && (
                    <span className="text-2xl font-normal ml-2 text-blue-100">
                      {author.credentials}
                    </span>
                  )}
                </h1>
                
                {author.jobTitle && (
                  <p className="text-xl text-blue-100 mb-4">
                    {author.jobTitle}
                    {author.company && <span> tại {author.company}</span>}
                  </p>
                )}

                <p className="text-lg leading-relaxed mb-6 max-w-3xl">
                  {author.bio}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{author.postCount || 0}</div>
                    <div className="text-blue-200 text-sm">Bài viết</div>
                  </div>
                  {author.reviewedCount > 0 && (
                    <div className="text-center">
                      <div className="text-3xl font-bold">{author.reviewedCount}</div>
                      <div className="text-blue-200 text-sm">Đã kiểm duyệt</div>
                    </div>
                  )}
                  {author.yearsOfExperience && (
                    <div className="text-center">
                      <div className="text-3xl font-bold">{author.yearsOfExperience}</div>
                      <div className="text-blue-200 text-sm">Năm kinh nghiệm</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Full Bio */}
              {author.bioFull && (
                <section className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {author.bioFull}
                    </p>
                  </div>
                </section>
              )}

              {/* Recent Posts */}
              {recentPosts && recentPosts.length > 0 && (
                <section className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-2xl font-bold mb-6">
                    Bài viết của {author.name}
                  </h2>
                  <div className="space-y-6">
                    {recentPosts.map((post: any) => (
                      <article
                        key={post.id}
                        className="flex gap-4 pb-6 border-b last:border-b-0 last:pb-0"
                      >
                        {post.featuredImage && (
                          <Link href={`/blog/${post.slug}`} className="flex-shrink-0">
                            <Image
                              src={post.featuredImage}
                              alt={post.title}
                              width={120}
                              height={80}
                              className="rounded-lg object-cover"
                              unoptimized={post.featuredImage.includes('blob.vercel-storage.com')}
                            />
                          </Link>
                        )}
                        <div className="flex-1">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-lg font-semibold hover:text-blue-600 transition-colors block mb-2"
                          >
                            {post.title}
                          </Link>
                          {post.excerpt && (
                            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                              {post.excerpt}
                            </p>
                          )}
                          {post.publishedAt && (
                            <time className="text-xs text-gray-500">
                              {new Date(post.publishedAt).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </time>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>

                  {author.postCount > recentPosts.length && (
                    <div className="mt-6 text-center">
                      <Link
                        href={`/blog?author=${author.slug}`}
                        className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Xem tất cả {author.postCount} bài viết
                      </Link>
                    </div>
                  )}
                </section>
              )}

              {(!recentPosts || recentPosts.length === 0) && (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                  <p className="text-gray-500">
                    {author.name} chưa có bài viết nào.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* E-E-A-T Credentials */}
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">Thông tin chuyên môn</h3>
                <div className="space-y-4">
                  {author.education && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">
                        🎓 Học vấn
                      </h4>
                      <p className="text-sm text-gray-600">{author.education}</p>
                    </div>
                  )}

                  {author.expertise && author.expertise.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        🎯 Chuyên môn
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {author.expertise.map((item: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {author.certifications && author.certifications.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        📜 Chứng chỉ
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {author.certifications.map((cert: string, index: number) => (
                          <li key={index}>• {cert}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {author.awards && author.awards.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        🏆 Giải thưởng
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {author.awards.map((award: string, index: number) => (
                          <li key={index}>• {award}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Links */}
              {author.socialLinks && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-bold mb-4">Kết nối</h3>
                  <div className="space-y-3">
                    {author.socialLinks.website && (
                      <a
                        href={author.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                        Website
                      </a>
                    )}
                    {author.socialLinks.linkedin && (
                      <a
                        href={author.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                    {author.socialLinks.twitter && (
                      <a
                        href={author.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                        Twitter
                      </a>
                    )}
                    {author.socialLinks.facebook && (
                      <a
                        href={author.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Generate static paths for all authors (optional - for SSG)
export async function generateStaticParams() {
  // This could fetch all author slugs from the database
  // For now, return empty array to use ISR instead of SSG
  return [];
}

