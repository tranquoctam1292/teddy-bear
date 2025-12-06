import Image from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';

export interface CustomImageOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, unknown>;
}

export const CustomImage = Image.extend<CustomImageOptions>({
  name: 'image',

  addOptions() {
    return {
      ...this.parent?.(),
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute('src'),
        renderHTML: (attributes) => {
          if (!attributes.src) {
            return {};
          }
          return {
            src: attributes.src,
          };
        },
      },
      alt: {
        default: null,
        parseHTML: (element) => element.getAttribute('alt'),
        renderHTML: (attributes) => {
          if (!attributes.alt) {
            return {};
          }
          return {
            alt: attributes.alt,
          };
        },
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute('title'),
        renderHTML: (attributes) => {
          if (!attributes.title) {
            return {};
          }
          return {
            title: attributes.title,
          };
        },
      },
      width: {
        default: null,
        parseHTML: (element) => {
          // Try to get width from style first (supports percentages)
          const styleWidth = element.style.width;
          if (styleWidth) {
            return styleWidth;
          }

          // Fallback to width attribute
          const widthAttr = element.getAttribute('width');
          if (widthAttr) {
            // If it's a number, assume pixels, otherwise return as-is (could be percentage)
            const numWidth = parseInt(widthAttr, 10);
            if (!isNaN(numWidth)) {
              return `${numWidth}px`;
            }
            return widthAttr;
          }

          return null;
        },
        renderHTML: () => {
          // Width is handled in renderHTML method via style
          return {};
        },
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const height = element.getAttribute('height') || element.style.height;
          if (height) {
            return height;
          }
          return null;
        },
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {};
          }
          return {};
        },
      },
      align: {
        default: 'left',
        parseHTML: (element) => {
          // Check align attribute
          const alignAttr = element.getAttribute('align');
          if (alignAttr === 'center' || alignAttr === 'right' || alignAttr === 'left') {
            return alignAttr;
          }

          // Check style for text-align
          const textAlign = element.style.textAlign;
          if (textAlign === 'center') return 'center';

          // Check style for float
          const float = element.style.float;
          if (float === 'left' || float === 'right') return float;

          // Check for margin: auto (center alignment)
          if (element.style.margin === '0px auto' || element.style.margin === 'auto') {
            return 'center';
          }

          return 'left';
        },
        renderHTML: () => {
          // Alignment will be handled in renderHTML method
          return {};
        },
      },
      href: {
        default: null,
        parseHTML: (element) => {
          // Check if image is wrapped in <a> tag
          const parent = element.parentElement;
          if (parent && parent.tagName === 'A') {
            return parent.getAttribute('href');
          }
          return null;
        },
        renderHTML: () => {
          // href is handled in renderHTML method by wrapping in <a>
          return {};
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { align, width, height, href, ...rest } = HTMLAttributes;

    // Build style string based on attributes
    const styles: string[] = [];

    // Handle alignment
    if (align === 'center') {
      styles.push('display: block');
      styles.push('margin-left: auto');
      styles.push('margin-right: auto');
    } else if (align === 'right' || align === 'left') {
      styles.push(`float: ${align}`);
    }

    // Handle width - render to inline style with !important to override Tailwind Prose
    if (width) {
      let widthValue: string;

      if (typeof width === 'string') {
        // Already a string (could be "50%", "25%", "500px", etc.)
        widthValue = width;
      } else if (typeof width === 'number') {
        // Number - convert to pixels
        widthValue = `${width}px`;
      } else {
        // Fallback
        widthValue = String(width);
      }

      // Use !important to force override Tailwind Prose img { width: 100%; }
      styles.push(`width: ${widthValue} !important`);
    }

    // Handle height
    if (height) {
      let heightValue: string;

      if (typeof height === 'string') {
        heightValue = height;
      } else if (typeof height === 'number') {
        heightValue = `${height}px`;
      } else {
        heightValue = String(height);
      }

      styles.push(`height: ${heightValue} !important`);
    } else if (width) {
      // If width is set but no height, set height: auto to maintain aspect ratio
      styles.push('height: auto !important');
    }

    // Ensure max-width doesn't conflict when width is set as percentage
    // When width is percentage, don't set max-width (let width control it)
    // When width is pixels, add max-width: 100% for responsiveness
    if (!width || (typeof width === 'string' && !width.includes('%'))) {
      styles.push('max-width: 100% !important');
    } else if (width && typeof width === 'string' && width.includes('%')) {
      // For percentage widths, override max-width to allow the percentage to work
      styles.push('max-width: none !important');
    }

    const style = styles.length > 0 ? styles.join('; ') : undefined;

    // Merge attributes
    const imgAttributes: Record<string, unknown> = {
      ...rest,
      style,
    };

    // Add class to help override Tailwind Prose if needed
    // CSS will handle the override via specificity
    if (width) {
      const existingClass = rest.class || '';
      imgAttributes.class = `tiptap-image-custom ${existingClass}`.trim();
    }

    const imgElement = [
      'img',
      mergeAttributes(this.options.HTMLAttributes, imgAttributes),
    ] as const;

    // If href exists, wrap image in <a> tag
    if (href) {
      return [
        'a',
        {
          href: String(href),
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        imgElement,
      ] as const;
    }

    return imgElement;
  },
});

export default CustomImage;
