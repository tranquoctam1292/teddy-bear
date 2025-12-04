// Post Editor: Author Box Widget (Sidebar)
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PostAuthorInfo, GuestAuthor } from '@/lib/types/author';

interface Author {
  id: string;
  name: string;
  slug: string;
  avatar?: string;
  jobTitle?: string;
  credentials?: string;
  type: string;
}

interface AuthorBoxWidgetProps {
  value?: PostAuthorInfo;
  onChange: (authorInfo: PostAuthorInfo) => void;
}

export default function AuthorBoxWidget({ value, onChange }: AuthorBoxWidgetProps) {
  // Author selection
  const [authorId, setAuthorId] = useState(value?.authorId || '');
  const [authorName, setAuthorName] = useState(value?.authorName || '');
  
  // Reviewer selection
  const [reviewerId, setReviewerId] = useState(value?.reviewerId || '');
  const [reviewerName, setReviewerName] = useState(value?.reviewerName || '');
  
  // Guest author
  const [isGuestAuthor, setIsGuestAuthor] = useState(!!value?.guestAuthor);
  const [guestAuthor, setGuestAuthor] = useState<GuestAuthor | undefined>(value?.guestAuthor);
  
  // Review date
  const [reviewDate, setReviewDate] = useState(
    value?.lastReviewedDate ? new Date(value.lastReviewedDate).toISOString().split('T')[0] : ''
  );
  
  // Author search
  const [authorSearch, setAuthorSearch] = useState('');
  const [authorResults, setAuthorResults] = useState<Author[]>([]);
  const [showAuthorResults, setShowAuthorResults] = useState(false);
  
  // Reviewer search
  const [reviewerSearch, setReviewerSearch] = useState('');
  const [reviewerResults, setReviewerResults] = useState<Author[]>([]);
  const [showReviewerResults, setShowReviewerResults] = useState(false);

  // Update parent when values change
  useEffect(() => {
    const authorInfo: PostAuthorInfo = {
      ...(isGuestAuthor ? {
        guestAuthor,
      } : {
        authorId: authorId || undefined,
        authorName: authorName || undefined,
      }),
      ...(reviewerId && {
        reviewerId,
        reviewerName,
      }),
      ...(reviewDate && {
        lastReviewedDate: new Date(reviewDate),
      }),
    };
    
    onChange(authorInfo);
  }, [authorId, authorName, reviewerId, reviewerName, guestAuthor, reviewDate, isGuestAuthor, onChange]);

  // Search authors
  const searchAuthors = async (query: string, isReviewer = false) => {
    if (!query || query.length < 2) {
      if (isReviewer) {
        setReviewerResults([]);
      } else {
        setAuthorResults([]);
      }
      return;
    }

    try {
      const res = await fetch(`/api/authors/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (res.ok) {
        if (isReviewer) {
          setReviewerResults(data.authors || []);
        } else {
          setAuthorResults(data.authors || []);
        }
      }
    } catch (error) {
      console.error('Error searching authors:', error);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (authorSearch) {
        searchAuthors(authorSearch, false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [authorSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (reviewerSearch) {
        searchAuthors(reviewerSearch, true);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [reviewerSearch]);

  const selectAuthor = (author: Author) => {
    setAuthorId(author.id);
    setAuthorName(author.name);
    setAuthorSearch(author.name);
    setShowAuthorResults(false);
  };

  const selectReviewer = (author: Author) => {
    setReviewerId(author.id);
    setReviewerName(author.name);
    setReviewerSearch(author.name);
    setShowReviewerResults(false);
  };

  const clearAuthor = () => {
    setAuthorId('');
    setAuthorName('');
    setAuthorSearch('');
  };

  const clearReviewer = () => {
    setReviewerId('');
    setReviewerName('');
    setReviewerSearch('');
  };

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="font-semibold text-gray-900">📝 Tác giả</h3>
        <span className="text-xs text-gray-500">E-E-A-T SEO</span>
      </div>

      {/* Guest Author Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <label className="text-sm font-medium text-gray-700">
          Guest Author (Tác giả khách)
        </label>
        <button
          type="button"
          onClick={() => setIsGuestAuthor(!isGuestAuthor)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isGuestAuthor ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isGuestAuthor ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {!isGuestAuthor ? (
        <>
          {/* Primary Author Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tác giả chính <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={authorSearch || authorName}
                onChange={(e) => {
                  setAuthorSearch(e.target.value);
                  setShowAuthorResults(true);
                }}
                onFocus={() => setShowAuthorResults(true)}
                placeholder="Tìm tác giả..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              
              {showAuthorResults && authorResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {authorResults.map((author) => (
                    <button
                      key={author.id}
                      type="button"
                      onClick={() => selectAuthor(author)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                    >
                      {author.avatar ? (
                        <Image
                          src={author.avatar}
                          alt={author.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
                          {author.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {author.name}
                          {author.credentials && (
                            <span className="text-gray-500 ml-1">({author.credentials})</span>
                          )}
                        </div>
                        {author.jobTitle && (
                          <div className="text-xs text-gray-500">{author.jobTitle}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {authorId && (
              <div className="mt-2 flex items-center justify-between p-2 bg-blue-50 rounded">
                <span className="text-sm text-blue-900">✓ {authorName}</span>
                <button
                  type="button"
                  onClick={clearAuthor}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Xóa
                </button>
              </div>
            )}
          </div>

          {/* Reviewer Selection (YMYL) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Người kiểm duyệt (Reviewer)
              <span className="text-xs text-gray-500 ml-2">Optional - For YMYL</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={reviewerSearch || reviewerName}
                onChange={(e) => {
                  setReviewerSearch(e.target.value);
                  setShowReviewerResults(true);
                }}
                onFocus={() => setShowReviewerResults(true)}
                placeholder="Tìm chuyên gia kiểm duyệt..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
              
              {showReviewerResults && reviewerResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {reviewerResults.map((author) => (
                    <button
                      key={author.id}
                      type="button"
                      onClick={() => selectReviewer(author)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                    >
                      {author.avatar ? (
                        <Image
                          src={author.avatar}
                          alt={author.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">
                          {author.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {author.name}
                          {author.credentials && (
                            <span className="text-green-600 ml-1">({author.credentials})</span>
                          )}
                        </div>
                        {author.jobTitle && (
                          <div className="text-xs text-gray-500">{author.jobTitle}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {reviewerId && (
              <div className="mt-2 flex items-center justify-between p-2 bg-green-50 rounded">
                <span className="text-sm text-green-900">✓ {reviewerName}</span>
                <button
                  type="button"
                  onClick={clearReviewer}
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  Xóa
                </button>
              </div>
            )}
            
            <p className="mt-1 text-xs text-gray-500">
              💡 Quan trọng cho nội dung Y tế, Tài chính (YMYL)
            </p>
          </div>

          {/* Review Date */}
          {reviewerId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày kiểm duyệt
              </label>
              <input
                type="date"
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}
        </>
      ) : (
        /* Guest Author Form */
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên tác giả khách <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={guestAuthor?.name || ''}
              onChange={(e) => setGuestAuthor({ ...guestAuthor, name: e.target.value })}
              placeholder="VD: John Doe"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar URL
            </label>
            <input
              type="url"
              value={guestAuthor?.avatar || ''}
              onChange={(e) => setGuestAuthor({ ...guestAuthor, avatar: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio ngắn
            </label>
            <textarea
              value={guestAuthor?.bio || ''}
              onChange={(e) => setGuestAuthor({ ...guestAuthor, bio: e.target.value })}
              rows={2}
              maxLength={200}
              placeholder="Mô tả ngắn về tác giả..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chức danh
            </label>
            <input
              type="text"
              value={guestAuthor?.jobTitle || ''}
              onChange={(e) => setGuestAuthor({ ...guestAuthor, jobTitle: e.target.value })}
              placeholder="VD: Senior Writer"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bằng cấp/Học vị
            </label>
            <input
              type="text"
              value={guestAuthor?.credentials || ''}
              onChange={(e) => setGuestAuthor({ ...guestAuthor, credentials: e.target.value })}
              placeholder="VD: PhD, MBA"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong>💡 E-E-A-T SEO:</strong> Google đánh giá cao nội dung có thông tin tác giả rõ ràng. 
          Với nội dung Y tế/Tài chính, nên có Reviewer (chuyên gia kiểm duyệt).
        </p>
      </div>
    </div>
  );
}

