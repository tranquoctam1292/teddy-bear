#!/usr/bin/env tsx
/**
 * Script: Create Sample Authors for Testing
 * 
 * Creates sample author profiles with full E-E-A-T data
 * 
 * Run: npx tsx scripts/create-sample-authors.ts
 */

import 'dotenv/config';
import { getCollections } from '../src/lib/db';

const sampleAuthors = [
  {
    name: 'Dr. Nguyễn Văn An',
    slug: 'dr-nguyen-van-an',
    email: 'nguyen.van.an@hospital.vn',
    bio: 'Bác sĩ chuyên khoa tim mạch với 15 năm kinh nghiệm, từng công tác tại Bệnh viện Đại học Y Hà Nội.',
    bioFull: 'Bác sĩ Nguyễn Văn An là chuyên gia hàng đầu về tim mạch tại Việt Nam với hơn 15 năm kinh nghiệm lâm sàng. Ông từng điều trị thành công hàng nghìn ca bệnh tim mạch phức tạp và là tác giả của nhiều bài báo khoa học được công bố trên các tạp chí y học quốc tế uy tín.',
    jobTitle: 'Bác sĩ Chuyên khoa Tim mạch',
    company: 'Bệnh viện Đại học Y Hà Nội',
    expertise: ['Tim mạch', 'Cao huyết áp', 'Suy tim', 'Phòng ngừa bệnh tim'],
    credentials: 'MD, PhD',
    education: 'Đại học Y Hà Nội, Đại học Johns Hopkins (Mỹ)',
    certifications: [
      'Chứng chỉ Chuyên khoa Tim mạch cấp 2',
      'Chứng chỉ Siêu âm tim Quốc tế',
      'Board Certification in Cardiology',
    ],
    awards: [
      'Giải thưởng Thầy thuốc trẻ xuất sắc 2020',
      'Bằng khen của Bộ trưởng Bộ Y tế',
    ],
    yearsOfExperience: 15,
    socialLinks: {
      website: 'https://drnguyen.com',
      linkedin: 'https://linkedin.com/in/drnguyen',
    },
    type: 'expert' as const,
    status: 'active' as const,
    metaDescription: 'Bác sĩ Tim mạch Nguyễn Văn An - 15 năm kinh nghiệm, chuyên gia hàng đầu về tim mạch tại Việt Nam.',
  },
  {
    name: 'Phạm Thị Mai',
    slug: 'pham-thi-mai',
    email: 'pham.mai@emotionalhouse.vn',
    bio: 'Biên tập viên chính với 8 năm kinh nghiệm trong lĩnh vực sức khỏe và làm đẹp. Tốt nghiệp Đại học Báo chí.',
    bioFull: 'Phạm Thị Mai là biên tập viên chính của Emotional House với hơn 8 năm kinh nghiệm viết lách và biên tập nội dung về sức khỏe, làm đẹp và lối sống. Cô đã viết hàng trăm bài báo được đăng tải trên các trang web và tạp chí uy tín.',
    jobTitle: 'Biên tập viên Chính',
    company: 'Emotional House',
    expertise: ['Sức khỏe', 'Làm đẹp', 'Dinh dưỡng', 'Lifestyle'],
    education: 'Đại học Báo chí & Truyền thông',
    yearsOfExperience: 8,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/phammai',
      facebook: 'https://facebook.com/phammai.writer',
    },
    type: 'staff' as const,
    status: 'active' as const,
    metaDescription: 'Biên tập viên Phạm Thị Mai - Chuyên gia nội dung về sức khỏe và làm đẹp với 8 năm kinh nghiệm.',
  },
  {
    name: 'Trần Minh Tuấn',
    slug: 'tran-minh-tuan',
    email: 'tran.tuan@emotionalhouse.vn',
    bio: 'Cộng tác viên chuyên viết về công nghệ và xu hướng. Tốt nghiệp CNTT, đam mê viết lách.',
    bioFull: 'Trần Minh Tuấn là kỹ sư CNTT kiêm cộng tác viên viết lách. Anh có niềm đam mê với công nghệ và luôn cập nhật những xu hướng mới nhất. Các bài viết của anh thường mang tính thực tiễn và dễ hiểu.',
    jobTitle: 'Cộng tác viên',
    company: 'Freelancer',
    expertise: ['Công nghệ', 'Review sản phẩm', 'Xu hướng'],
    education: 'Đại học Bách Khoa',
    yearsOfExperience: 5,
    socialLinks: {
      website: 'https://tranminhtuan.blog',
      twitter: 'https://twitter.com/tranminhtuan',
    },
    type: 'contributor' as const,
    status: 'active' as const,
  },
  {
    name: 'Lê Thị Hương',
    slug: 'le-thi-huong',
    email: 'le.huong@nutrition.vn',
    bio: 'Chuyên gia dinh dưỡng với 12 năm kinh nghiệm tư vấn và nghiên cứu về dinh dưỡng học.',
    bioFull: 'ThS. Lê Thị Hương là chuyên gia dinh dưỡng hàng đầu tại Việt Nam với 12 năm kinh nghiệm trong lĩnh vực tư vấn dinh dưỡng, nghiên cứu và đào tạo. Cô đã tư vấn cho hàng nghìn khách hàng về chế độ ăn uống khoa học và lành mạnh.',
    jobTitle: 'Chuyên gia Dinh dưỡng',
    company: 'Viện Dinh dưỡng Quốc gia',
    expertise: ['Dinh dưỡng', 'Giảm cân', 'Ăn uống lành mạnh', 'Thực phẩm chức năng'],
    credentials: 'MSc, RD',
    education: 'Thạc sĩ Dinh dưỡng học - Đại học Y Dược TP.HCM',
    certifications: [
      'Chứng chỉ Dinh dưỡng lâm sàng',
      'Registered Dietitian',
    ],
    awards: [
      'Chuyên gia Dinh dưỡng xuất sắc 2021',
    ],
    yearsOfExperience: 12,
    socialLinks: {
      website: 'https://lehuong-nutrition.vn',
      linkedin: 'https://linkedin.com/in/lehuong',
      facebook: 'https://facebook.com/chuyengia.lehuong',
    },
    type: 'expert' as const,
    status: 'active' as const,
    metaDescription: 'Chuyên gia Dinh dưỡng Lê Thị Hương - 12 năm kinh nghiệm, chuyên tư vấn chế độ ăn khoa học.',
  },
];

async function createSampleAuthors() {
  console.log('🔄 Creating sample authors...\n');

  try {
    const { authors } = await getCollections();

    let createdCount = 0;
    let skippedCount = 0;

    for (const authorData of sampleAuthors) {
      // Check if author already exists
      const existing = await authors.findOne({ slug: authorData.slug });

      if (existing) {
        console.log(`⏭️  Skipping "${authorData.name}" - already exists`);
        skippedCount++;
        continue;
      }

      // Create author
      const newAuthor = {
        ...authorData,
        postCount: 0,
        reviewedCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await authors.insertOne(newAuthor);
      console.log(`✅ Created author: ${authorData.name} (${authorData.type})`);
      createdCount++;
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Created: ${createdCount}`);
    console.log(`⏭️  Skipped: ${skippedCount}`);
    console.log('='.repeat(50));

    if (createdCount > 0) {
      console.log('\n🎉 Sample authors created successfully!');
      console.log('\nYou can now:');
      console.log('1. View authors at: http://localhost:3000/admin/authors');
      console.log('2. Assign them to posts');
      console.log('3. Run migration: npx tsx scripts/migrate-author-info.ts');
    } else {
      console.log('\n✓ All sample authors already exist.');
    }

  } catch (error) {
    console.error('\n❌ Error creating authors:', error);
    process.exit(1);
  }
}

// Run script
createSampleAuthors()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });

