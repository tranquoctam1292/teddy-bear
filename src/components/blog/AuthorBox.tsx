// Frontend: Author Box Component
import Link from 'next/link';
import Image from 'next/image';
import { Author } from '@/lib/types/author';

interface AuthorBoxProps {
  author: Author | {
    name: string;
    avatar?: string;
    bio?: string;
    jobTitle?: string;
    credentials?: string;
    socialLinks?: {
      website?: string;
      linkedin?: string;
      twitter?: string;
      facebook?: string;
    };
  };
  variant?: 'compact' | 'detailed';
  showBio?: boolean;
  showSocial?: boolean;
  showCredentials?: boolean;
  className?: string;
}

export default function AuthorBox({
  author,
  variant = 'detailed',
  showBio = true,
  showSocial = true,
  showCredentials = true,
  className = '',
}: AuthorBoxProps) {
  const isFullAuthor = 'slug' in author;
  const slug = isFullAuthor ? (author as Author).slug : null;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Avatar */}
        {author.avatar ? (
          <Image
            src={author.avatar}
            alt={author.name}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {author.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Info */}
        <div className="flex-1">
          {slug ? (
            <Link
              href={`/author/${slug}`}
              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {author.name}
              {author.credentials && (
                <span className="text-sm text-gray-600 ml-1">
                  , {author.credentials}
                </span>
              )}
            </Link>
          ) : (
            <p className="font-semibold text-gray-900">
              {author.name}
              {author.credentials && (
                <span className="text-sm text-gray-600 ml-1">
                  , {author.credentials}
                </span>
              )}
            </p>
          )}
          {author.jobTitle && (
            <p className="text-sm text-gray-600">{author.jobTitle}</p>
          )}
        </div>
      </div>
    );
  }

  // Detailed variant
  return (
    <div className={`bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200 shadow-sm ${className}`}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {author.avatar ? (
            <Image
              src={author.avatar}
              alt={author.name}
              width={120}
              height={120}
              className="rounded-2xl object-cover shadow-md"
            />
          ) : (
            <div className="w-30 h-30 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-4xl">
                {author.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name & Title */}
          <div className="mb-3">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {slug ? (
                <Link href={`/author/${slug}`} className="hover:text-blue-600 transition-colors">
                  {author.name}
                </Link>
              ) : (
                author.name
              )}
              {author.credentials && (
                <span className="text-lg text-gray-600 font-normal ml-2">
                  {author.credentials}
                </span>
              )}
            </h3>
            {author.jobTitle && (
              <p className="text-base text-gray-700 font-medium">
                {author.jobTitle}
                {'company' in author && author.company && (
                  <span className="text-gray-600"> tại {author.company}</span>
                )}
              </p>
            )}
          </div>

          {/* Bio */}
          {showBio && author.bio && (
            <p className="text-gray-700 leading-relaxed mb-4">
              {author.bio}
            </p>
          )}

          {/* E-E-A-T Credentials */}
          {showCredentials && isFullAuthor && (
            <div className="mb-4 space-y-2">
              {(author as Author).education && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-blue-600 font-semibold">🎓 Học vấn:</span>
                  <span className="text-gray-700">{(author as Author).education}</span>
                </div>
              )}
              {(author as Author).yearsOfExperience && (author as Author).yearsOfExperience! > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 font-semibold">💼 Kinh nghiệm:</span>
                  <span className="text-gray-700">{(author as Author).yearsOfExperience} năm</span>
                </div>
              )}
              {(author as Author).expertise && (author as Author).expertise!.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-purple-600 font-semibold">🎯 Chuyên môn:</span>
                  <div className="flex flex-wrap gap-1">
                    {(author as Author).expertise!.map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Social Links */}
          {showSocial && author.socialLinks && (
            <div className="flex flex-wrap gap-3">
              {author.socialLinks.website && (
                <a
                  href={author.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                  LinkedIn
                </a>
              )}
              {author.socialLinks.twitter && (
                <a
                  href={author.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>
              )}
            </div>
          )}

          {/* View Full Profile Link */}
          {slug && (
            <div className="mt-4 pt-4 border-t border-gray-300">
              <Link
                href={`/author/${slug}`}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <span>Xem hồ sơ đầy đủ</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

