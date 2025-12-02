// Câu chuyện thương hiệu
import { Heart, Sparkles, Users, Award } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Về chúng tôi - The Emotional House',
  description: 'Câu chuyện về The Emotional House - Nơi gắn kết cảm xúc qua những chú gấu bông đầy yêu thương.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="text-6xl">🐻</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Câu chuyện của chúng tôi
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            The Emotional House được sinh ra từ niềm tin rằng mỗi chú gấu bông không chỉ là một món đồ chơi,
            mà còn là người bạn đồng hành, mang theo những cảm xúc và kỷ niệm đẹp nhất.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Sứ mệnh của chúng tôi
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Chúng tôi mong muốn mang đến những chú gấu bông chất lượng cao, được làm từ nguyên liệu an toàn,
                với thiết kế đáng yêu và đầy cảm xúc. Mỗi sản phẩm đều được chăm chút tỉ mỉ để trở thành
                món quà ý nghĩa cho những người thân yêu.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Từ những dịp đặc biệt như sinh nhật, tốt nghiệp, Valentine đến những khoảnh khắc đơn giản
                trong cuộc sống, chúng tôi tin rằng một chú gấu bông có thể truyền tải tình cảm một cách
                chân thành và ấm áp nhất.
              </p>
            </div>
            <div className="relative aspect-square bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="w-32 h-32 text-pink-400 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-pink-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Giá trị cốt lõi
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="inline-block p-4 bg-pink-100 rounded-full mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tình yêu</h3>
              <p className="text-gray-600">
                Mỗi sản phẩm đều được tạo ra với tình yêu và sự chăm chút, để mang lại niềm vui cho khách hàng.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="inline-block p-4 bg-pink-100 rounded-full mb-4">
                <Award className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Chất lượng</h3>
              <p className="text-gray-600">
                Chúng tôi cam kết sử dụng nguyên liệu cao cấp, an toàn và bền đẹp cho mọi sản phẩm.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="inline-block p-4 bg-pink-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Dịch vụ</h3>
              <p className="text-gray-600">
                Đội ngũ tư vấn nhiệt tình, hỗ trợ khách hàng 24/7 và dịch vụ gói quà tận tâm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Sparkles className="w-12 h-12 text-pink-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Hành trình của chúng tôi
            </h2>
          </div>
          
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Khởi đầu</h3>
                <p className="text-gray-600">
                  The Emotional House được thành lập với mong muốn đơn giản: tạo ra những chú gấu bông
                  không chỉ đẹp mà còn mang ý nghĩa sâu sắc, trở thành người bạn đồng hành trong cuộc sống.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Phát triển</h3>
                <p className="text-gray-600">
                  Qua nhiều năm, chúng tôi đã mở rộng danh mục sản phẩm với nhiều kích thước và nhân vật khác nhau,
                  từ gấu bông cổ điển đến các nhân vật hoạt hình được yêu thích.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tương lai</h3>
                <p className="text-gray-600">
                  Chúng tôi tiếp tục đổi mới và cải thiện, luôn lắng nghe phản hồi từ khách hàng để mang đến
                  những trải nghiệm tốt nhất. Mục tiêu của chúng tôi là trở thành thương hiệu gấu bông
                  được tin yêu nhất tại Việt Nam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-500 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Hãy cùng chúng tôi tạo nên những kỷ niệm đẹp
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Khám phá bộ sưu tập gấu bông của chúng tôi và tìm người bạn đồng hành hoàn hảo cho bạn.
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-colors"
          >
            Xem sản phẩm
          </Link>
        </div>
      </section>
    </div>
  );
}
