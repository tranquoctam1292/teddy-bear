'use client';

// Lazy-loaded wrapper for SizeGuideModal
// This reduces bundle size by ~100KB until user clicks "Size Guide"
import dynamic from 'next/dynamic';

const SizeGuideModal = dynamic(() => import('./SizeGuideModal'), {
  loading: () => null, // Modal không hiển thị gì khi đang load (vì chỉ load khi isOpen=true)
  ssr: false, // Framer Motion is client-only
});

export default SizeGuideModal;

