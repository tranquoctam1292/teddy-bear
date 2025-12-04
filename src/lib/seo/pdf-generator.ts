/**
 * PDF Report Generator
 * Generates PDF reports using jsPDF (client-side) or server-side PDF generation
 */

export interface PDFReportOptions {
  title: string;
  subtitle?: string;
  reportData: any;
  reportType: 'seo-audit' | 'keyword-performance' | 'content-analysis';
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
}

/**
 * Generate PDF report HTML (for server-side PDF generation)
 * This HTML can be converted to PDF using libraries like puppeteer, playwright, or html-pdf
 */
export function generateReportHTML(options: PDFReportOptions): string {
  const { title, subtitle, reportData, generatedAt, period } = options;

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 40px;
      background: #fff;
    }
    .header {
      border-bottom: 3px solid #2563eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1e40af;
      font-size: 28px;
      margin-bottom: 5px;
    }
    .header .subtitle {
      color: #64748b;
      font-size: 14px;
    }
    .meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      padding: 15px;
      background: #f8fafc;
      border-radius: 8px;
    }
    .meta-item {
      flex: 1;
    }
    .meta-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .meta-value {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
    }
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 20px;
      color: #1e40af;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e2e8f0;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    .summary-card {
      background: #f8fafc;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #2563eb;
    }
    .summary-label {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 5px;
    }
    .summary-value {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .table th {
      background: #1e40af;
      color: #fff;
      padding: 12px;
      text-align: left;
      font-size: 14px;
      font-weight: 600;
    }
    .table td {
      padding: 12px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }
    .table tr:hover {
      background: #f8fafc;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-error {
      background: #fee2e2;
      color: #991b1b;
    }
    .badge-warning {
      background: #fef3c7;
      color: #92400e;
    }
    .badge-info {
      background: #dbeafe;
      color: #1e40af;
    }
    .badge-success {
      background: #d1fae5;
      color: #065f46;
    }
    .recommendations {
      background: #eff6ff;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #2563eb;
    }
    .recommendations ul {
      list-style: none;
      padding-left: 0;
    }
    .recommendations li {
      padding: 8px 0;
      padding-left: 25px;
      position: relative;
    }
    .recommendations li:before {
      content: "→";
      position: absolute;
      left: 0;
      color: #2563eb;
      font-weight: bold;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 12px;
    }
    @media print {
      body {
        padding: 20px;
      }
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${title}</h1>
    ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ''}
  </div>

  <div class="meta">
    <div class="meta-item">
      <div class="meta-label">Ngày tạo</div>
      <div class="meta-value">${formatDate(generatedAt)}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Từ ngày</div>
      <div class="meta-value">${formatDate(period.start)}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Đến ngày</div>
      <div class="meta-value">${formatDate(period.end)}</div>
    </div>
  </div>

  ${generateReportSections(reportData, options.reportType)}

  <div class="footer">
    <p>Báo cáo được tạo tự động bởi SEO Management Center - The Emotional House</p>
    <p>Report ID: ${reportData.reportId}</p>
  </div>
</body>
</html>
  `;

  return html;
}

function generateReportSections(reportData: any, reportType: string): string {
  let sections = '';

  // Summary section
  if (reportData.summary) {
    sections += '<div class="section">';
    sections += '<h2 class="section-title">Tóm tắt</h2>';
    sections += '<div class="summary-grid">';

    Object.entries(reportData.summary).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        Object.entries(value as Record<string, any>).forEach(([k, v]) => {
          sections += `
            <div class="summary-card">
              <div class="summary-label">${formatKey(key + '.' + k)}</div>
              <div class="summary-value">${v}</div>
            </div>
          `;
        });
      } else if (typeof value !== 'object') {
        sections += `
          <div class="summary-card">
            <div class="summary-label">${formatKey(key)}</div>
            <div class="summary-value">${value}</div>
          </div>
        `;
      }
    });

    sections += '</div></div>';
  }

  // Top Issues
  if (reportData.topIssues && reportData.topIssues.length > 0) {
    sections += '<div class="section">';
    sections += '<h2 class="section-title">Vấn đề Hàng đầu</h2>';
    sections += '<table class="table">';
    sections += '<thead><tr><th>Loại</th><th>Vấn đề</th><th>Field</th><th>Trang bị ảnh hưởng</th><th>Gợi ý</th></tr></thead>';
    sections += '<tbody>';

    reportData.topIssues.forEach((issue: any) => {
      const badgeClass = issue.type === 'error' ? 'badge-error' : issue.type === 'warning' ? 'badge-warning' : 'badge-info';
      sections += `
        <tr>
          <td><span class="badge ${badgeClass}">${issue.type}</span></td>
          <td>${issue.message}</td>
          <td>${issue.field}</td>
          <td>${issue.affectedPages}</td>
          <td>${issue.suggestion || '-'}</td>
        </tr>
      `;
    });

    sections += '</tbody></table></div>';
  }

  // Top Performers
  if (reportData.topPerformers && reportData.topPerformers.length > 0) {
    sections += '<div class="section">';
    sections += '<h2 class="section-title">Từ khóa Tốt nhất</h2>';
    sections += '<table class="table">';
    sections += '<thead><tr><th>Từ khóa</th><th>Thứ hạng hiện tại</th><th>Thứ hạng trước</th><th>Thay đổi</th><th>Search Volume</th></tr></thead>';
    sections += '<tbody>';

    reportData.topPerformers.forEach((performer: any) => {
      sections += `
        <tr>
          <td>${performer.keyword}</td>
          <td>#${performer.currentRank}</td>
          <td>${performer.previousRank ? '#' + performer.previousRank : '-'}</td>
          <td><span class="badge badge-success">+${performer.rankChange}</span></td>
          <td>${performer.searchVolume || '-'}</td>
        </tr>
      `;
    });

    sections += '</tbody></table></div>';
  }

  // Top Decliners
  if (reportData.topDecliners && reportData.topDecliners.length > 0) {
    sections += '<div class="section">';
    sections += '<h2 class="section-title">Từ khóa Giảm hạng</h2>';
    sections += '<table class="table">';
    sections += '<thead><tr><th>Từ khóa</th><th>Thứ hạng hiện tại</th><th>Thứ hạng trước</th><th>Thay đổi</th></tr></thead>';
    sections += '<tbody>';

    reportData.topDecliners.forEach((decliner: any) => {
      sections += `
        <tr>
          <td>${decliner.keyword}</td>
          <td>#${decliner.currentRank}</td>
          <td>${decliner.previousRank ? '#' + decliner.previousRank : '-'}</td>
          <td><span class="badge badge-error">${decliner.rankChange}</span></td>
        </tr>
      `;
    });

    sections += '</tbody></table></div>';
  }

  // Recommendations
  if (reportData.recommendations && reportData.recommendations.length > 0) {
    sections += '<div class="section">';
    sections += '<h2 class="section-title">Khuyến nghị</h2>';
    sections += '<div class="recommendations">';
    sections += '<ul>';

    reportData.recommendations.forEach((rec: string) => {
      sections += `<li>${rec}</li>`;
    });

    sections += '</ul></div></div>';
  }

  return sections;
}

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Generate PDF using HTML (requires puppeteer or similar)
 * This is a placeholder - actual implementation would use puppeteer/playwright
 */
export async function generatePDFFromHTML(html: string): Promise<Buffer> {
  // In production, this would use puppeteer or playwright to convert HTML to PDF
  // For now, return empty buffer (implementation requires puppeteer)
  throw new Error('PDF generation requires puppeteer or similar library. Please install puppeteer or use a PDF service.');
}



