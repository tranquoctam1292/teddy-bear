// Author Form Component - Reusable for Create/Edit
'use client';

import { useState, useEffect } from 'react';
import { Author } from '@/lib/types/author';
import { generateAuthorSlug } from '@/lib/schemas/author';

interface AuthorFormProps {
  initialData?: Partial<Author>;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function AuthorForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: AuthorFormProps) {
  // Basic Info
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [avatar, setAvatar] = useState(initialData?.avatar || '');

  // Bio & Experience
  const [bio, setBio] = useState(initialData?.bio || '');
  const [bioFull, setBioFull] = useState(initialData?.bioFull || '');

  // Job & Expertise
  const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || '');
  const [company, setCompany] = useState(initialData?.company || '');
  const [expertise, setExpertise] = useState<string[]>(initialData?.expertise || []);
  const [expertiseInput, setExpertiseInput] = useState('');

  // E-E-A-T Credentials
  const [credentials, setCredentials] = useState(initialData?.credentials || '');
  const [education, setEducation] = useState(initialData?.education || '');
  const [certifications, setCertifications] = useState<string[]>(
    initialData?.certifications || []
  );
  const [certificationInput, setCertificationInput] = useState('');
  const [awards, setAwards] = useState<string[]>(initialData?.awards || []);
  const [awardInput, setAwardInput] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(
    initialData?.yearsOfExperience || 0
  );

  // Social Links
  const [website, setWebsite] = useState(initialData?.socialLinks?.website || '');
  const [linkedin, setLinkedin] = useState(initialData?.socialLinks?.linkedin || '');
  const [twitter, setTwitter] = useState(initialData?.socialLinks?.twitter || '');
  const [facebook, setFacebook] = useState(initialData?.socialLinks?.facebook || '');
  const [instagram, setInstagram] = useState(initialData?.socialLinks?.instagram || '');
  const [youtube, setYoutube] = useState(initialData?.socialLinks?.youtube || '');

  // Settings
  const [type, setType] = useState<Author['type']>(initialData?.type || 'contributor');
  const [status, setStatus] = useState<Author['status']>(initialData?.status || 'active');
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || '');

  // Auto-generate slug from name
  useEffect(() => {
    if (name && !initialData?.slug) {
      setSlug(generateAuthorSlug(name));
    }
  }, [name, initialData?.slug]);

  // Character count for bio
  const bioCharCount = bio.length;
  const bioFullCharCount = bioFull.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      name,
      slug,
      email: email || undefined,
      avatar: avatar || undefined,
      bio,
      bioFull: bioFull || undefined,
      jobTitle: jobTitle || undefined,
      company: company || undefined,
      expertise: expertise.length > 0 ? expertise : undefined,
      credentials: credentials || undefined,
      education: education || undefined,
      certifications: certifications.length > 0 ? certifications : undefined,
      awards: awards.length > 0 ? awards : undefined,
      yearsOfExperience: yearsOfExperience > 0 ? yearsOfExperience : undefined,
      socialLinks: {
        website: website || undefined,
        linkedin: linkedin || undefined,
        twitter: twitter || undefined,
        facebook: facebook || undefined,
        instagram: instagram || undefined,
        youtube: youtube || undefined,
      },
      type,
      status,
      metaDescription: metaDescription || undefined,
    };

    await onSubmit(formData);
  };

  // Array helpers
  const addExpertise = () => {
    if (expertiseInput.trim() && expertise.length < 10) {
      setExpertise([...expertise, expertiseInput.trim()]);
      setExpertiseInput('');
    }
  };

  const removeExpertise = (index: number) => {
    setExpertise(expertise.filter((_, i) => i !== index));
  };

  const addCertification = () => {
    if (certificationInput.trim() && certifications.length < 10) {
      setCertifications([...certifications, certificationInput.trim()]);
      setCertificationInput('');
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const addAward = () => {
    if (awardInput.trim() && awards.length < 10) {
      setAwards([...awards, awardInput.trim()]);
      setAwardInput('');
    }
  };

  const removeAward = (index: number) => {
    setAwards(awards.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <section className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="text-blue-600 mr-2">📝</span>
          Thông tin cơ bản
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tên tác giả <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nguyễn Văn An"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Slug (URL) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              pattern="^[a-z0-9-]+$"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="nguyen-van-an"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL: /author/{slug || 'slug-here'}
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="nguyen.van.an@example.com"
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium mb-1">Avatar URL</label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/avatar.jpg"
            />
            {avatar && (
              <div className="mt-2">
                <img
                  src={avatar}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-full object-cover border-2"
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              💡 Tip: Upload ảnh lên Media Library trước rồi paste URL vào đây
            </p>
          </div>
        </div>
      </section>

      {/* Bio & Experience */}
      <section className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="text-green-600 mr-2">✍️</span>
          Tiểu sử & Kinh nghiệm
        </h2>

        <div className="space-y-4">
          {/* Short Bio */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tiểu sử ngắn (Short Bio) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              minLength={50}
              maxLength={200}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Mô tả ngắn gọn về tác giả (50-200 ký tự) - Dùng cho SEO meta description"
            />
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-500">Độ dài: 50-200 ký tự (tối ưu cho SEO)</span>
              <span className={bioCharCount < 50 || bioCharCount > 200 ? 'text-red-500' : 'text-green-600'}>
                {bioCharCount}/200
              </span>
            </div>
          </div>

          {/* Full Bio */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tiểu sử đầy đủ (Full Bio)
            </label>
            <textarea
              value={bioFull}
              onChange={(e) => setBioFull(e.target.value)}
              maxLength={2000}
              rows={6}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Tiểu sử chi tiết cho trang profile tác giả (tối đa 2000 ký tự)"
            />
            <p className="text-xs text-gray-500 mt-1">
              {bioFullCharCount}/2000 ký tự
            </p>
          </div>
        </div>
      </section>

      {/* Job & Expertise */}
      <section className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="text-purple-600 mr-2">💼</span>
          Công việc & Chuyên môn
        </h2>

        <div className="space-y-4">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Chức danh</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              maxLength={100}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="VD: Bác sĩ Chuyên khoa Tim mạch"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium mb-1">Công ty/Tổ chức</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              maxLength={100}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="VD: Bệnh viện Đại học Y Hà Nội"
            />
          </div>

          {/* Expertise */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Lĩnh vực chuyên môn (Expertise)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={expertiseInput}
                onChange={(e) => setExpertiseInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="VD: Tim mạch, Cao huyết áp..."
              />
              <button
                type="button"
                onClick={addExpertise}
                disabled={expertise.length >= 10}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Thêm
              </button>
            </div>
            {expertise.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {expertise.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeExpertise(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {expertise.length}/10 lĩnh vực
            </p>
          </div>
        </div>
      </section>

      {/* E-E-A-T Credentials */}
      <section className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="text-yellow-600 mr-2">🏆</span>
          Chứng chỉ & Thành tựu (E-E-A-T)
        </h2>

        <div className="space-y-4">
          {/* Credentials */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Bằng cấp/Học vị (Credentials)
            </label>
            <input
              type="text"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              maxLength={100}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="VD: MD, PhD, MBA"
            />
            <p className="text-xs text-gray-500 mt-1">
              Sẽ hiển thị sau tên: "Nguyễn Văn An, MD, PhD"
            </p>
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium mb-1">Học vấn (Education)</label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              maxLength={200}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="VD: Đại học Y Hà Nội, Harvard Medical School"
            />
          </div>

          {/* Years of Experience */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Số năm kinh nghiệm
            </label>
            <input
              type="number"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(parseInt(e.target.value) || 0)}
              min={0}
              max={70}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="15"
            />
          </div>

          {/* Certifications */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Chứng chỉ (Certifications)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={certificationInput}
                onChange={(e) => setCertificationInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="VD: Board Certification in Cardiology"
              />
              <button
                type="button"
                onClick={addCertification}
                disabled={certifications.length >= 10}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Thêm
              </button>
            </div>
            {certifications.length > 0 && (
              <ul className="mt-2 space-y-1">
                {certifications.map((cert, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{cert}</span>
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Awards */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Giải thưởng (Awards)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={awardInput}
                onChange={(e) => setAwardInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAward())}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="VD: Giải thưởng Thầy thuốc trẻ xuất sắc 2023"
              />
              <button
                type="button"
                onClick={addAward}
                disabled={awards.length >= 10}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Thêm
              </button>
            </div>
            {awards.length > 0 && (
              <ul className="mt-2 space-y-1">
                {awards.map((award, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{award}</span>
                    <button
                      type="button"
                      onClick={() => removeAward(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="text-indigo-600 mr-2">🔗</span>
          Liên kết mạng xã hội
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn (quan trọng)</label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Twitter</label>
            <input
              type="url"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://twitter.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Facebook</label>
            <input
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://facebook.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Instagram</label>
            <input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://instagram.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">YouTube</label>
            <input
              type="url"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://youtube.com/@username"
            />
          </div>
        </div>
      </section>

      {/* Settings */}
      <section className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="text-gray-600 mr-2">⚙️</span>
          Cài đặt
        </h2>

        <div className="space-y-4">
          {/* Author Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Loại tác giả</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Author['type'])}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="staff">Biên tập viên (Staff)</option>
              <option value="contributor">Cộng tác viên (Contributor)</option>
              <option value="expert">Chuyên gia (Expert)</option>
              <option value="guest">Khách mời (Guest)</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Author['status'])}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm dừng</option>
            </select>
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Meta Description (SEO)
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              maxLength={160}
              rows={2}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Mô tả SEO cho trang author (tối đa 160 ký tự)"
            />
            <p className="text-xs text-gray-500 mt-1">
              {metaDescription.length}/160 ký tự
            </p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Hủy
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          )}
          {isLoading ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Tạo tác giả'}
        </button>
      </div>
    </form>
  );
}

