// Frontend: Reviewer Box Component (YMYL Compliance)
import Link from 'next/link';
import Image from 'next/image';
import { Author } from '@/lib/types/author';

interface ReviewerBoxProps {
  reviewer: Author | {
    name: string;
    avatar?: string;
    jobTitle?: string;
    credentials?: string;
    slug?: string;
  };
  reviewDate?: Date;
  className?: string;
}

export default function ReviewerBox({
  reviewer,
  reviewDate,
  className = '',
}: ReviewerBoxProps) {
  const hasSlug = 'slug' in reviewer && reviewer.slug;

  return (
    <div className={`bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-l-4 border-green-500 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-green-900">
          Được kiểm duyệt bởi chuyên gia
        </h3>
      </div>

      {/* Reviewer Info */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        {reviewer.avatar ? (
          <Image
            src={reviewer.avatar}
            alt={reviewer.name}
            width={64}
            height={64}
            className="rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xl">
              {reviewer.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Details */}
        <div className="flex-1">
          <div className="mb-2">
            {hasSlug ? (
              <Link
                href={`/author/${reviewer.slug}`}
                className="text-lg font-bold text-gray-900 hover:text-green-600 transition-colors"
              >
                {reviewer.name}
              </Link>
            ) : (
              <p className="text-lg font-bold text-gray-900">{reviewer.name}</p>
            )}
            {reviewer.credentials && (
              <p className="text-sm font-semibold text-green-700 mt-0.5">
                {reviewer.credentials}
              </p>
            )}
          </div>

          {reviewer.jobTitle && (
            <p className="text-sm text-gray-700 mb-2">
              {reviewer.jobTitle}
            </p>
          )}

          {reviewDate && (
            <p className="text-xs text-gray-600">
              📅 Ngày kiểm duyệt: {new Date(reviewDate).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>

      {/* Medical Disclaimer (for YMYL content) */}
      <div className="mt-4 pt-3 border-t border-green-200">
        <p className="text-xs text-gray-600 leading-relaxed">
          ℹ️ <strong>Lưu ý:</strong> Nội dung trên đây chỉ mang tính chất tham khảo, 
          tra cứu, không thể thay thế cho việc chẩn đoán hoặc điều trị y khoa. 
          Nếu bạn cần hỗ trợ cụ thể, vui lòng tham khảo ý kiến bác sĩ hoặc chuyên gia.
        </p>
      </div>
    </div>
  );
}

