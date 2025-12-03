'use client';

// SEO Score Circle Component (RankMath style)
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Target,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Hash
} from 'lucide-react';

interface SEOChecklist {
  keyword: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  featuredImage?: string;
}

interface SEOCheckItem {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  icon: any;
}

interface SEOScoreCircleProps {
  data: SEOChecklist;
  onScoreChange?: (score: number) => void;
}

export default function SEOScoreCircle({ data, onScoreChange }: SEOScoreCircleProps) {
  const [score, setScore] = useState(0);
  const [checks, setChecks] = useState<SEOCheckItem[]>([]);

  useEffect(() => {
    const newChecks = runSEOChecks(data);
    setChecks(newChecks);

    // Calculate score
    const totalChecks = newChecks.length;
    const passedChecks = newChecks.filter(c => c.status === 'pass').length;
    const warningChecks = newChecks.filter(c => c.status === 'warning').length;
    
    const calculatedScore = Math.round((passedChecks / totalChecks) * 100 + (warningChecks / totalChecks) * 50);
    setScore(calculatedScore);
    onScoreChange?.(calculatedScore);
  }, [data, onScoreChange]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Xuất sắc';
    if (score >= 80) return 'Tốt';
    if (score >= 60) return 'Cần cải thiện';
    return 'Kém';
  };

  const passedCount = checks.filter(c => c.status === 'pass').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;
  const failedCount = checks.filter(c => c.status === 'fail').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-5 w-5" />
          Điểm SEO
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Circle */}
        <div className="flex items-center justify-center">
          <div className="relative">
            {/* Circular Progress */}
            <svg className="transform -rotate-90" width="120" height="120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="8"
                strokeDasharray={`${(score / 100) * 326.73} 326.73`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            
            {/* Score Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
              <span className="text-xs text-gray-500">/ 100</span>
            </div>
          </div>
        </div>

        {/* Score Label */}
        <div className="text-center">
          <p className={`text-lg font-semibold ${getScoreColor(score)}`}>
            {getScoreLabel(score)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {passedCount} đạt • {warningCount} cảnh báo • {failedCount} lỗi
          </p>
        </div>

        {/* SEO Checklist */}
        <div className="space-y-2 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Danh sách kiểm tra SEO</h4>
          <div className="space-y-2">
            {checks.map((check) => (
              <div
                key={check.id}
                className="flex items-start gap-2 text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {check.status === 'pass' && (
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                )}
                {check.status === 'fail' && (
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                {check.status === 'warning' && (
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${
                    check.status === 'pass' ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {check.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{check.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="flex gap-2 pt-2">
          <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
            {passedCount} Đạt
          </Badge>
          {warningCount > 0 && (
            <Badge variant="default" className="bg-yellow-100 text-yellow-800 text-xs">
              {warningCount} Cảnh báo
            </Badge>
          )}
          {failedCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {failedCount} Lỗi
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// SEO Checks Logic
function runSEOChecks(data: SEOChecklist): SEOCheckItem[] {
  const checks: SEOCheckItem[] = [];
  const keyword = data.keyword.toLowerCase();
  const title = data.title.toLowerCase();
  const description = data.description.toLowerCase();
  const content = data.content.toLowerCase();
  const slug = data.slug.toLowerCase();

  // 1. Focus Keyword
  if (!keyword) {
    checks.push({
      id: 'focus-keyword',
      label: 'Từ khóa chính',
      status: 'fail',
      message: 'Chưa đặt từ khóa chính',
      icon: Target,
    });
  } else {
    checks.push({
      id: 'focus-keyword',
      label: 'Đã đặt từ khóa chính',
      status: 'pass',
      message: `Từ khóa chính: "${data.keyword}"`,
      icon: Target,
    });
  }

  // 2. Keyword in Title
  if (keyword && title.includes(keyword)) {
    checks.push({
      id: 'keyword-in-title',
      label: 'Từ khóa trong tiêu đề',
      status: 'pass',
      message: 'Từ khóa chính xuất hiện trong tiêu đề',
      icon: FileText,
    });
  } else if (keyword) {
    checks.push({
      id: 'keyword-in-title',
      label: 'Từ khóa trong tiêu đề',
      status: 'fail',
      message: 'Không tìm thấy từ khóa chính trong tiêu đề',
      icon: FileText,
    });
  }

  // 3. Keyword in Description
  if (keyword && description.includes(keyword)) {
    checks.push({
      id: 'keyword-in-desc',
      label: 'Từ khóa trong mô tả',
      status: 'pass',
      message: 'Từ khóa chính xuất hiện trong mô tả',
      icon: FileText,
    });
  } else if (keyword) {
    checks.push({
      id: 'keyword-in-desc',
      label: 'Từ khóa trong mô tả',
      status: 'warning',
      message: 'Nên thêm từ khóa vào mô tả',
      icon: FileText,
    });
  }

  // 4. Keyword in URL
  if (keyword && slug.includes(keyword.replace(/\s+/g, '-'))) {
    checks.push({
      id: 'keyword-in-url',
      label: 'Từ khóa trong URL',
      status: 'pass',
      message: 'URL thân thiện với SEO',
      icon: LinkIcon,
    });
  } else if (keyword) {
    checks.push({
      id: 'keyword-in-url',
      label: 'Keyword in URL',
      status: 'warning',
      message: 'URL could be more keyword-focused',
      icon: LinkIcon,
    });
  }

  // 5. Keyword in Content (first paragraph)
  const firstParagraph = content.split('</p>')[0] || content.substring(0, 200);
  if (keyword && firstParagraph.includes(keyword)) {
    checks.push({
      id: 'keyword-in-intro',
      label: 'Từ khóa trong phần mở đầu',
      status: 'pass',
      message: 'Từ khóa xuất hiện trong đoạn đầu tiên',
      icon: FileText,
    });
  } else if (keyword) {
    checks.push({
      id: 'keyword-in-intro',
      label: 'Từ khóa trong phần mở đầu',
      status: 'fail',
      message: 'Thêm từ khóa vào phần mở đầu để tối ưu SEO',
      icon: FileText,
    });
  }

  // 6. Content Length
  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount >= 600) {
    checks.push({
      id: 'content-length',
      label: 'Độ dài nội dung',
      status: 'pass',
      message: `${wordCount} từ (Tốt cho SEO)`,
      icon: FileText,
    });
  } else if (wordCount >= 300) {
    checks.push({
      id: 'content-length',
      label: 'Độ dài nội dung',
      status: 'warning',
      message: `${wordCount} từ (Nên thêm nội dung)`,
      icon: FileText,
    });
  } else {
    checks.push({
      id: 'content-length',
      label: 'Độ dài nội dung',
      status: 'fail',
      message: `${wordCount} từ (Quá ngắn, cần 600+ từ)`,
      icon: FileText,
    });
  }

  // 7. Featured Image
  if (data.featuredImage) {
    checks.push({
      id: 'featured-image',
      label: 'Ảnh đại diện',
      status: 'pass',
      message: 'Đã có ảnh đại diện',
      icon: ImageIcon,
    });
  } else {
    checks.push({
      id: 'featured-image',
      label: 'Ảnh đại diện',
      status: 'warning',
      message: 'Thêm ảnh đại diện để tăng tương tác',
      icon: ImageIcon,
    });
  }

  // 8. Title Length
  if (data.title.length >= 30 && data.title.length <= 60) {
    checks.push({
      id: 'title-length',
      label: 'Độ dài tiêu đề tối ưu',
      status: 'pass',
      message: `${data.title.length} ký tự (Hoàn hảo)`,
      icon: FileText,
    });
  } else if (data.title.length > 0) {
    checks.push({
      id: 'title-length',
      label: 'Độ dài tiêu đề',
      status: 'warning',
      message: data.title.length > 60 ? 'Tiêu đề quá dài' : 'Tiêu đề quá ngắn',
      icon: FileText,
    });
  }

  // 9. Description Length
  if (data.description.length >= 70 && data.description.length <= 160) {
    checks.push({
      id: 'desc-length',
      label: 'Độ dài mô tả tối ưu',
      status: 'pass',
      message: `${data.description.length} ký tự (Hoàn hảo)`,
      icon: FileText,
    });
  } else if (data.description.length > 0) {
    checks.push({
      id: 'desc-length',
      label: 'Độ dài mô tả',
      status: 'warning',
      message: data.description.length > 160 ? 'Mô tả quá dài' : 'Mô tả quá ngắn',
      icon: FileText,
    });
  }

  // 10. Images in Content
  const imageCount = (content.match(/<img/g) || []).length;
  if (imageCount >= 1) {
    checks.push({
      id: 'images-in-content',
      label: 'Ảnh trong nội dung',
      status: 'pass',
      message: `Tìm thấy ${imageCount} ảnh`,
      icon: ImageIcon,
    });
  } else {
    checks.push({
      id: 'images-in-content',
      label: 'Ảnh trong nội dung',
      status: 'warning',
      message: 'Nên thêm ảnh vào nội dung',
      icon: ImageIcon,
    });
  }

  return checks;
}

