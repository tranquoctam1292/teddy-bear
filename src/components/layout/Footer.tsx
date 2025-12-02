'use client';

// Footer component với links và thông tin liên hệ
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'Tất cả sản phẩm', href: '/products' },
    { name: 'Gấu bông mới', href: '/products?filter=new' },
    { name: 'Sản phẩm hot', href: '/products?filter=hot' },
    { name: 'Khuyến mãi', href: '/products?filter=sale' },
  ],
  support: [
    { name: 'Hướng dẫn mua hàng', href: '/help/shopping-guide' },
    { name: 'Chính sách đổi trả', href: '/help/return-policy' },
    { name: 'Chính sách bảo hành', href: '/help/warranty' },
    { name: 'Vận chuyển', href: '/help/shipping' },
  ],
  company: [
    { name: 'Về chúng tôi', href: '/about' },
    { name: 'Góc của Gấu', href: '/blog' },
    { name: 'Hệ thống cửa hàng', href: '/store' },
    { name: 'Tuyển dụng', href: '/careers' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { name: 'Youtube', icon: Youtube, href: 'https://youtube.com' },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-pink-50 to-white border-t border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-xl font-bold">🐻</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">The Emotional House</h3>
                <p className="text-xs text-gray-600">Gấu bông cao cấp</p>
              </div>
            </Link>
            <p className="text-sm text-gray-600">
              Mang đến những chú gấu bông đầy cảm xúc, gắn kết tình yêu và kỷ niệm đẹp.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-300 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5 text-gray-700" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Cửa hàng</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-pink-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-pink-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Hotline</p>
                  <a
                    href="tel:1900123456"
                    className="text-sm text-gray-600 hover:text-pink-600"
                  >
                    1900 123 456
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <a
                    href="mailto:hello@emotionalhouse.vn"
                    className="text-sm text-gray-600 hover:text-pink-600"
                  >
                    hello@emotionalhouse.vn
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Địa chỉ</p>
                  <p className="text-sm text-gray-600">
                    123 Đường ABC, Quận XYZ<br />
                    TP. Hồ Chí Minh
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 text-center md:text-left">
              © {new Date().getFullYear()} The Emotional House. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-pink-600 fill-current" />
              <span>in Vietnam</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
