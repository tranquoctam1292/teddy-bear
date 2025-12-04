'use client';

// Lazy-loaded wrapper for RichTextEditor
// This reduces initial bundle size by ~200KB on pages that don't use the editor
import dynamic from 'next/dynamic';
import RichTextEditorSkeleton from './RichTextEditorSkeleton';

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  loading: () => <RichTextEditorSkeleton />,
  ssr: false, // Tiptap is client-only
});

export default RichTextEditor;

