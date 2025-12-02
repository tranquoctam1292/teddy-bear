// Hệ thống cửa hàng
import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import type { Metadata } from 'next';
import MapButton from '@/components/store/MapButton';

export const metadata: Metadata = {
  title: 'Hệ thống cửa hàng - The Emotional House',
  description: 'Tìm cửa hàng The Emotional House gần bạn nhất. Chúng tôi có mặt tại nhiều thành phố trên cả nước.',
};

const stores = [
  {
    id: '1',
    name: 'The Emotional House - TP. Hồ Chí Minh',
    address: '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    phone: '028 1234 5678',
    email: 'hcm@emotionalhouse.vn',
    hours: '9:00 - 22:00 (Tất cả các ngày trong tuần)',
    lat: 10.7769,
    lng: 106.7009,
  },
  {
    id: '2',
    name: 'The Emotional House - Hà Nội',
    address: '456 Đường Hoàn Kiếm, Quận Hoàn Kiếm, Hà Nội',
    phone: '024 9876 5432',
    email: 'hanoi@emotionalhouse.vn',
    hours: '9:00 - 22:00 (Tất cả các ngày trong tuần)',
    lat: 21.0285,
    lng: 105.8542,
  },
  {
    id: '3',
    name: 'The Emotional House - Đà Nẵng',
    address: '789 Đường Bạch Đằng, Quận Hải Châu, Đà Nẵng',
    phone: '0236 5555 6666',
    email: 'danang@emotionalhouse.vn',
    hours: '9:00 - 21:30 (Tất cả các ngày trong tuần)',
    lat: 16.0544,
    lng: 108.2022,
  },
];

export default function StorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <MapPin className="w-16 h-16 text-pink-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Hệ thống cửa hàng
          </h1>
          <p className="text-xl text-gray-600">
            Tìm cửa hàng The Emotional House gần bạn nhất và đến trải nghiệm không gian đầy cảm xúc của chúng tôi
          </p>
        </div>
      </section>

      {/* Stores List */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {store.name}
                </h3>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">{store.address}</p>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-pink-600 flex-shrink-0" />
                    <a
                      href={`tel:${store.phone.replace(/\s/g, '')}`}
                      className="text-gray-600 text-sm hover:text-pink-600 transition-colors"
                    >
                      {store.phone}
                    </a>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-pink-600 flex-shrink-0" />
                    <a
                      href={`mailto:${store.email}`}
                      className="text-gray-600 text-sm hover:text-pink-600 transition-colors"
                    >
                      {store.email}
                    </a>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">{store.hours}</p>
                  </div>
                </div>

                {/* Map Button */}
                <MapButton lat={store.lat} lng={store.lng} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Bản đồ cửa hàng
          </h2>
          <div className="relative aspect-video bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                <p className="text-gray-600">
                  Tích hợp Google Maps sẽ được hiển thị tại đây
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  (Cần API key từ Google Maps Platform)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Không tìm thấy cửa hàng gần bạn?
          </h2>
          <p className="text-gray-600 mb-8">
            Đừng lo! Chúng tôi có dịch vụ giao hàng toàn quốc. Liên hệ với chúng tôi để được tư vấn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:1900123456"
              className="inline-flex items-center justify-center gap-2 bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Gọi ngay: 1900 123 456
            </a>
            <a
              href="mailto:hello@emotionalhouse.vn"
              className="inline-flex items-center justify-center gap-2 bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold border-2 border-pink-600 hover:bg-pink-50 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email: hello@emotionalhouse.vn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
