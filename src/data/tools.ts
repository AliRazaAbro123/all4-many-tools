import { ToolItem } from '../types/tool';

/**
 * Convert a lowercase slug into a Title-Case hyphenated route,
 * e.g. "word-counter" -> "Word-Counter", producing URLs like /Word-Counter
 */
export function toRoutePath(slug: string): string {
  return (
    '/' +
    slug
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('-')
  );
}

const RAW_TOOLS: ToolItem[] = [
  {
    id: 'pdf-to-image',
    name: 'PDF to Image Converter',
    slug: 'pdf-to-image',
    path: '/pdf-to-image',
    shortDescription: 'Convert PDF pages into high-resolution JPG, PNG, or WebP images instantly in your browser.',
    fullDescription: 'Extract every page of your PDF file as a high-quality PNG, JPG, or WebP image. Choose custom rendering DPI (up to 300 DPI for ultra-sharp clarity), preview each page interactively, and download individual pages or a single ZIP file containing all pages. 100% private and processed on your device.',
    category: 'pdf',
    icon: 'FileImage',
    badge: 'Popular',
    isPopular: true,
    keywords: ['pdf to image', 'pdf to png', 'pdf to jpg', 'convert pdf to photo', 'extract pdf pages', 'pdf renderer'],
    seoTitle: 'Free PDF to Image Converter - Convert PDF to PNG/JPG High Quality',
    seoDescription: 'Convert PDF documents to high quality PNG, JPG, or WebP images online for free. Custom resolution up to 300 DPI, page selection, batch ZIP export. 100% private.',
    features: [
      'High Resolution output (100 DPI to 300 DPI Ultra Sharp)',
      'Multiple export formats: PNG, JPG, WebP',
      'Download individual pages or ZIP bundle',
      'Interactive page preview & selection',
      '100% Private - No file uploads to server'
    ],
    faqs: [
      {
        question: 'Is my PDF uploaded to any external server?',
        answer: 'No. Everything is rendered 100% client-side inside your browser memory using HTML5 WebAssembly/Canvas technology. Your files never leave your computer.'
      },
      {
        question: 'Can I select specific pages to convert?',
        answer: 'Yes! You can preview all pages in the PDF document and select specific page ranges or individual pages to export.'
      },
      {
        question: 'What image quality options are available?',
        answer: 'You can choose between Standard (150 DPI), High Quality (200 DPI), and Ultra HD Crisp (300 DPI) for printing or presentation.'
      }
    ]
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF Converter',
    slug: 'image-to-pdf',
    path: '/image-to-pdf',
    shortDescription: 'Combine multiple images (JPG, PNG, WebP, SVG) into a single customized PDF document.',
    fullDescription: 'Convert photos and image files into a clean PDF file. Drag and drop multiple images, re-order pages with ease, select standard paper sizes (A4, Letter, Auto/Fit), set margins, orientation (Portrait/Landscape), and generate a downloadable PDF in seconds.',
    category: 'pdf',
    icon: 'FileText',
    badge: 'Popular',
    isPopular: true,
    keywords: ['image to pdf', 'jpg to pdf', 'png to pdf', 'merge photos to pdf', 'combine images to pdf', 'make pdf from photos'],
    seoTitle: 'Free Image to PDF Converter - Convert JPG & PNG to PDF Online',
    seoDescription: 'Convert JPG, PNG, WebP, and SVG images to a single customized PDF file online. Re-order pages, set page sizes (A4, Letter), margins, and orientation for free.',
    features: [
      'Combine unlimited images into one PDF',
      'Drag and drop page re-ordering',
      'Paper presets: A4, US Letter, Fit to Image',
      'Margin padding & page orientation options',
      'Fast client-side rendering with Instant Download'
    ],
    faqs: [
      {
        question: 'Can I reorder the images before creating the PDF?',
        answer: 'Yes, you can easily drag and drop or use arrow controls to reorder images exactly as you want them to appear in the generated PDF.'
      },
      {
        question: 'What page sizes are supported?',
        answer: 'We support standard sizes including A4, US Letter, Legal, as well as an "Auto / Fit Image" mode that fits the page directly to each image dimensions.'
      }
    ]
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    slug: 'image-resizer',
    path: '/image-resizer',
    shortDescription: 'Resize images to exact dimensions or percentage with aspect ratio lock.',
    fullDescription: 'Easily resize PNG, JPG, WebP, or GIF images. Enter exact pixel dimensions (Width & Height) or use scale sliders (25%, 50%, 75%, 200%). Lock aspect ratio to prevent distortion, choose resampling quality, and export formatted images.',
    category: 'image',
    icon: 'Scaling',
    badge: 'Essential',
    isPopular: true,
    keywords: ['image resizer', 'resize photo', 'change image size', 'resize png', 'resize jpg', 'scale picture'],
    seoTitle: 'Free Image Resizer - Resize JPG, PNG & WebP Online by Pixels or %',
    seoDescription: 'Resize photos and images online by pixel dimensions or scale percentage. Maintain aspect ratio, change output format, and optimize image size instantly for free.',
    features: [
      'Resize by Pixels or Percentage (%)',
      'Aspect ratio lock toggle',
      'Preset quick dimensions (HD, Full HD, 4K, Avatar, Banner)',
      'Side-by-side original vs resized dimensions readout',
      'Export as PNG, JPG, or WebP'
    ],
    faqs: [
      {
        question: 'Will resizing degrade image quality?',
        answer: 'Downscaling reduces file size without loss of sharpness. Upscaling uses high-bilinear smoothing canvas interpolation to keep images as clean as possible.'
      },
      {
        question: 'How do I maintain proportional aspect ratio?',
        answer: 'The aspect ratio lock icon is enabled by default. Simply change either Width or Height, and the other side automatically adjusts.'
      }
    ]
  },
  {
    id: 'image-converter',
    name: 'Image Converter',
    slug: 'image-converter',
    path: '/image-converter',
    shortDescription: 'Convert images between PNG, JPG, WebP, GIF, and BMP formats in batch.',
    fullDescription: 'Convert single or batch image files to popular web formats like PNG, JPG, WebP, and BMP. Adjust compression quality sliders, preview exact before-and-after file size savings, and download individually or as a ZIP archive.',
    category: 'converter',
    icon: 'RefreshCw',
    badge: 'Popular',
    isPopular: true,
    keywords: ['image converter', 'jpg to png', 'png to webp', 'webp to jpg', 'batch image converter', 'photo format converter'],
    seoTitle: 'Free Image Converter - Convert PNG, JPG, WebP & BMP Online',
    seoDescription: 'Convert image files to PNG, JPG, WebP, and BMP format online for free. Supports batch conversion, compression quality control, and instant ZIP downloads.',
    features: [
      'Batch convert multiple images at once',
      'Supports PNG, JPG, WebP, BMP formats',
      'Interactive quality compression slider (1% - 100%)',
      'File size savings calculation (e.g. 60% smaller)',
      'Download all converted files in one ZIP archive'
    ],
    faqs: [
      {
        question: 'Why convert images to WebP format?',
        answer: 'WebP provides superior compression and quality compared to JPG/PNG, reducing website load times and bandwidth consumption by up to 30-50%.'
      },
      {
        question: 'Is batch processing supported?',
        answer: 'Yes! Select or drop multiple images at once, choose target format, and convert all of them simultaneously.'
      }
    ]
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor & Optimizer',
    slug: 'image-compressor',
    path: '/image-compressor',
    shortDescription: 'Reduce PNG, JPG, and WebP file size up to 80% without visible quality loss.',
    fullDescription: 'Compress images for faster website load times and social media posting. Compare side-by-side split screen between the original image and the optimized compressed version. Fine-tune quality target and save megabytes of data.',
    category: 'image',
    icon: 'Minimize2',
    badge: 'Fast',
    isPopular: true,
    keywords: ['image compressor', 'compress image', 'reduce photo size', 'optimize image', 'tiny png alternative', 'compress jpg'],
    seoTitle: 'Free Image Compressor - Reduce Image File Size Online without Loss',
    seoDescription: 'Compress PNG, JPG, and WebP images online for free. Visual side-by-side comparison slider, quality fine-tuning, and up to 80% file size reduction.',
    features: [
      'Visual side-by-side split screen preview',
      'Exact file size reduction percentage display',
      'Custom compression level slider',
      'Preserves original dimensions while trimming metadata & data payload',
      'Batch optimization support'
    ],
    faqs: [
      {
        question: 'How much can I reduce my image size?',
        answer: 'Most images can be reduced by 50% to 85% with no human-perceivable difference in visual quality.'
      }
    ]
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper & Rotate',
    slug: 'image-cropper',
    path: '/image-cropper',
    shortDescription: 'Crop images with preset ratios (1:1, 16:9, 4:3, 9:16) and rotate/flip.',
    fullDescription: 'Crop unwanted areas from your photos with precision visual crop handles. Includes popular social media presets like Instagram Square (1:1), Story/Reels (9:16), YouTube Thumbnail (16:9), and Facebook post (4:3). Rotate 90°, flip horizontally or vertically, and download high-res cropped images.',
    category: 'image',
    icon: 'Crop',
    badge: 'Essential',
    isPopular: false,
    keywords: ['image cropper', 'crop photo', 'rotate image', 'crop instagram photo', 'crop 16:9', 'flip picture'],
    seoTitle: 'Free Image Cropper & Rotator - Crop Photos Online with Aspect Ratios',
    seoDescription: 'Crop photos online with aspect ratio presets (1:1, 16:9, 9:16, 4:3), freeform selection, rotation, and mirror flipping. Instant download.',
    features: [
      'Social media aspect ratio presets (1:1, 16:9, 9:16, 4:3, 3:2)',
      'Freeform custom crop area selection',
      '90° left/right rotation & horizontal/vertical flipping',
      'Live pixel crop size indicator',
      'Full resolution export'
    ],
    faqs: [
      {
        question: 'Can I crop for Instagram Reels or YouTube Thumbnails?',
        answer: 'Yes! Select the 9:16 preset for Instagram Reels/TikTok or 16:9 for YouTube Thumbnails.'
      }
    ]
  },
  {
    id: 'color-picker',
    name: 'Image Color Picker & Palette',
    slug: 'color-picker',
    path: '/color-picker',
    shortDescription: 'Extract HEX/RGB colors from images and generate full color palettes.',
    fullDescription: 'Upload any photo or graphics image, click anywhere on the canvas with the magnifying glass color picker to inspect exact HEX, RGB, HSL, and HSV color codes. Automatically extracts dominant color palettes with 1-click copy and CSS export options.',
    category: 'utility',
    icon: 'Palette',
    badge: 'New',
    isPopular: false,
    keywords: ['color picker', 'extract color from image', 'image color palette', 'hex color picker', 'eyedropper online', 'css color extractor'],
    seoTitle: 'Free Image Color Picker & Palette Generator - Extract HEX/RGB from Image',
    seoDescription: 'Extract exact HEX, RGB, and HSL colors from any uploaded image with zoom eyedropper. Generate auto palette with CSS variable export.',
    features: [
      'Interactive zoom lens eyedropper tool',
      'HEX, RGB, HSL, and HSV format conversion',
      'Auto-generated top 6 dominant color palette',
      'One-click copy to clipboard',
      'Export palette as CSS variables or JSON'
    ],
    faqs: [
      {
        question: 'How accurate is the eyedropper?',
        answer: 'It renders pixel-perfect canvas colors from your image at original native resolution.'
      }
    ]
  },
  {
    id: 'pdf-merge',
    name: 'PDF Merge & Combine',
    slug: 'pdf-merge',
    path: '/pdf-merge',
    shortDescription: 'Combine multiple PDF files into one ordered document.',
    fullDescription: 'Select multiple PDF files, arrange their order with intuitive drag-and-drop or position buttons, and merge them into a single consolidated PDF file in seconds. Fast, secure, and preserves high PDF vector rendering.',
    category: 'pdf',
    icon: 'Layers',
    badge: 'Popular',
    isPopular: true,
    keywords: ['pdf merge', 'combine pdf', 'join pdf files', 'merge pdfs online', 'pdf binder'],
    seoTitle: 'Free PDF Merge Tool - Combine Multiple PDFs into One Document',
    seoDescription: 'Merge and combine multiple PDF documents into a single organized PDF file online for free. Drag and drop reordering, zero file size limits, 100% private.',
    features: [
      'Merge unlimited PDF documents into one',
      'Drag-and-drop re-ordering',
      'Page count overview for each uploaded document',
      'Preserves fonts, vector graphics & layout',
      'Instant client-side processing'
    ],
    faqs: [
      {
        question: 'Is there a file limit on merged PDFs?',
        answer: 'Since processing is done inside your browser, there are no artificial file size limits or paywalls.'
      }
    ]
  },
  {
    id: 'pdf-split',
    name: 'PDF Splitter & Page Extractor',
    slug: 'pdf-split',
    path: '/pdf-split',
    shortDescription: 'Split PDF files into individual pages or extract specific page ranges.',
    fullDescription: 'Upload a PDF file, view thumbnail previews of all pages, and split the PDF into separate single-page documents, or extract specific page ranges (e.g., 1-3, 5, 8-10) into a single new PDF document.',
    category: 'pdf',
    icon: 'Scissors',
    badge: 'Essential',
    isPopular: false,
    keywords: ['pdf split', 'extract pdf pages', 'split pdf online', 'separate pdf pages', 'cut pdf'],
    seoTitle: 'Free PDF Splitter - Extract Pages & Split PDF Documents Online',
    seoDescription: 'Split PDF documents into separate pages or extract selected page ranges online for free. Visual page selection and instant ZIP export.',
    features: [
      'Visual thumbnail grid of all PDF pages',
      'Select custom page ranges (e.g. 1, 3-5, 8)',
      'Extract selected pages to a single new PDF or individual PDFs',
      'Download all split pages as a single ZIP archive',
      'Zero quality degradation'
    ],
    faqs: [
      {
        question: 'How do range selections work?',
        answer: 'You can type ranges like "1-4, 7, 9-12" or simply click on page thumbnails to highlight and select them.'
      }
    ]
  },
  {
    id: 'pdf-watermark',
    name: 'PDF Watermark & Page Numbers',
    slug: 'pdf-watermark',
    path: '/pdf-watermark',
    shortDescription: 'Add text watermarks (e.g. "CONFIDENTIAL") or page numbers to PDF files.',
    fullDescription: 'Protect your PDF documents by adding customizable text watermarks across pages (e.g., "CONFIDENTIAL", "DRAFT", "COPY", or company name), or insert dynamic page numbers ("Page 1 of 10") with custom placement, font size, opacity, and rotation angle.',
    category: 'pdf',
    icon: 'Stamp',
    badge: 'New',
    isPopular: false,
    keywords: ['pdf watermark', 'add page numbers to pdf', 'watermark pdf online', 'stamp pdf', 'confidential watermark pdf'],
    seoTitle: 'Free PDF Watermark & Page Number Tool - Add Watermark to PDF Online',
    seoDescription: 'Add text watermarks and page numbers to PDF documents online for free. Customize font, size, opacity, angle, and position with live preview.',
    features: [
      'Custom watermark text or page numbering presets',
      'Adjust opacity, rotation angle (-45° to 45°), and text size',
      'Position placement (Center, Top, Bottom, Corners)',
      'Live page preview before exporting',
      'Apply to all pages or custom page ranges'
    ],
    faqs: [
      {
        question: 'Can I add "Page X of Y" numbers?',
        answer: 'Yes! Select the Page Number mode, choose position (e.g. Bottom Right), and customize font size.'
      }
    ]
  },
  {
    id: 'svg-converter',
    name: 'SVG to PNG/JPG Converter & Scaler',
    slug: 'svg-converter',
    path: '/svg-converter',
    shortDescription: 'Convert SVG vector files into high-resolution raster PNG or JPG images.',
    fullDescription: 'Convert SVG code or SVG files into crisp high-definition raster images (PNG with transparency, or JPG with custom background color). Select upscale multipliers up to 8x resolution (4K / 8K crisp icon output).',
    category: 'converter',
    icon: 'Code2',
    badge: 'PRO Free',
    isPopular: false,
    keywords: ['svg to png', 'svg converter', 'svg to jpg', 'scale svg', 'rasterize svg', 'convert vector to photo'],
    seoTitle: 'Free SVG to PNG & JPG Converter - Scale SVG Vector Images High Quality',
    seoDescription: 'Convert SVG files and raw code to PNG and JPG images online for free. Custom dimensions, scale multipliers up to 8x, and transparent backgrounds.',
    features: [
      'Upload SVG file or paste raw SVG code string',
      'Retina scale multipliers (1x, 2x, 4x, 8x HD rasterization)',
      'Custom dimensions (Width x Height pixel inputs)',
      'Transparent background support for PNG',
      'Instant download as PNG or JPG'
    ],
    faqs: [
      {
        question: 'Can I paste raw SVG code directly?',
        answer: 'Yes! You can paste `<svg>...</svg>` code into the text area or drop an `.svg` file.'
      }
    ]
  },
  {
    id: 'text-to-pdf',
    name: 'Text & Markdown to PDF',
    slug: 'text-to-pdf',
    path: '/text-to-pdf',
    shortDescription: 'Write or paste plain text/markdown and format it into a clean PDF document.',
    fullDescription: 'Create clean, professional PDF documents from plain text, notes, or formatted markdown. Choose font style (Sans-Serif, Serif, Monospace), font size, line height, page margins, and download as a printable PDF instantly.',
    category: 'converter',
    icon: 'FileCode2',
    badge: 'Essential',
    isPopular: false,
    keywords: ['text to pdf', 'markdown to pdf', 'txt to pdf', 'convert text to pdf', 'make pdf from text'],
    seoTitle: 'Free Text to PDF Converter - Convert Plain Text & Notes to PDF Online',
    seoDescription: 'Convert plain text and Markdown into clean PDF documents online for free. Custom typography, margins, page layout, and instant download.',
    features: [
      'Live side-by-side text editor & PDF preview',
      'Font family options (Inter, Times, Monospace)',
      'Custom header title and page margins',
      'Download styled A4 PDF document'
    ],
    faqs: [
      {
        question: 'Does this support long multi-page documents?',
        answer: 'Yes! Long text automatically paginates onto multiple PDF pages with proper page breaks.'
      }
    ]
  },
  {
    id: 'favicon-generator',
    name: 'Favicon & App Icon Generator',
    slug: 'favicon-generator',
    path: '/favicon-generator',
    shortDescription: 'Generate complete favicons, Apple Touch icons, and Web Manifest assets.',
    fullDescription: 'Upload a logo or image to generate a complete bundle of favicon and icon files for your web application. Includes 16x16, 32x32, 48x48, 180x180 (Apple Touch Icon), 192x192, and 512x512 (Android PWA icons), along with ready-to-paste HTML header tag snippets!',
    category: 'utility',
    icon: 'Sparkles',
    badge: 'New',
    isPopular: true,
    keywords: ['favicon generator', 'app icon maker', 'pwa icon generator', 'apple touch icon creator', 'website favicon converter'],
    seoTitle: 'Free Favicon Generator - Create Website Favicons & Apple Touch Icons',
    seoDescription: 'Generate complete favicon packages and HTML tags from any image online for free. Includes 16x16, 32x32, Apple Touch 180x180, and Android PWA icons ZIP.',
    features: [
      'Generates standard favicon package (16x16, 32x32, 48x48, 180x180, 192x192, 512x512)',
      'Includes ready-to-copy `<link rel="icon">` HTML code snippets',
      'Download all sizes as a organized ZIP bundle',
      'Auto image centering & square padding options'
    ],
    faqs: [
      {
        question: 'What image input works best for favicons?',
        answer: 'A square PNG or vector logo with a transparent background works best for high quality across all browser tabs.'
      }
    ]
  },
  {
    id: 'image-filters',
    name: 'Image Filters & Adjustments Studio',
    slug: 'image-filters',
    path: '/image-filters',
    shortDescription: 'Apply photo filters (Grayscale, Sepia, Blur, Vintage) and tune brightness/contrast.',
    fullDescription: 'Transform your photos with real-time browser canvas adjustments. Fine-tune Brightness, Contrast, Saturation, Sepia, Grayscale, Blur, Invert, Hue Rotation, and apply retro vintage presets with immediate export.',
    category: 'image',
    icon: 'Sliders',
    badge: 'Essential',
    isPopular: false,
    keywords: ['image filters', 'photo editor online', 'grayscale filter', 'sepia filter', 'adjust brightness image', 'blur photo online'],
    seoTitle: 'Free Image Filters Studio - Adjust Brightness, Contrast & Photo Effects',
    seoDescription: 'Apply online image filters and adjustments like brightness, contrast, saturation, vintage, sepia, and grayscale. High-resolution canvas download.',
    features: [
      'Real-time HTML5 Canvas GPU rendering',
      'Adjust Brightness, Contrast, Saturation, Blur & Hue',
      'Preset filters (Cyberpunk, Vintage Warm, B&W High Contrast, Sepia Nostalgia)',
      '1-Click Reset & High-Resolution Export'
    ],
    faqs: [
      {
        question: 'Does this reduce original image resolution?',
        answer: 'No, all adjustment filters are calculated against your original pixel dimensions upon download.'
      }
    ]
  },
  {
    id: 'base64-image',
    name: 'Base64 Image Encoder & Decoder',
    slug: 'base64-image',
    path: '/base64-image',
    shortDescription: 'Convert images to Base64 data URIs or decode Base64 strings into downloadable images.',
    fullDescription: 'Convert PNG, JPG, WebP, or SVG files into Data URI Base64 strings for direct inline CSS / HTML embedding. Also supports decoding raw Base64 strings back into previewable and downloadable image files.',
    category: 'utility',
    icon: 'Binary',
    badge: 'Fast',
    isPopular: false,
    keywords: ['base64 image encoder', 'image to base64', 'base64 to image', 'data uri generator', 'css background image base64'],
    seoTitle: 'Free Base64 Image Encoder & Decoder - Image to Data URI Online',
    seoDescription: 'Convert images to Base64 Data URIs for inline HTML/CSS embedding, or decode Base64 strings back into image files online for free.',
    features: [
      'Image to Base64 Data URI conversion',
      'Formats for HTML `<img>`, CSS `background-image`, and Raw String',
      'Base64 string back to downloadable Image file decoder',
      '1-Click Copy code snippet & byte size readout'
    ],
    faqs: [
      {
        question: 'When should I use Base64 images?',
        answer: 'Base64 images are great for small icons, email HTML templates, or reducing separate HTTP network requests.'
      }
    ]
  },
  {
    id: 'exif-viewer',
    name: 'EXIF Metadata Inspector & Stripper',
    slug: 'exif-viewer',
    path: '/exif-viewer',
    shortDescription: 'View camera EXIF metadata (ISO, camera model, date) and strip sensitive info.',
    fullDescription: 'Inspect digital photos for hidden EXIF metadata including camera model, lens parameters, shutter speed, ISO, aperture, software, and creation date. Easily scrub and strip metadata to protect your privacy before posting online.',
    category: 'utility',
    icon: 'Info',
    badge: 'PRO Free',
    isPopular: false,
    keywords: ['exif viewer', 'remove exif metadata', 'photo metadata cleaner', 'view camera details photo', 'privacy metadata stripper'],
    seoTitle: 'Free EXIF Viewer & Metadata Stripper - Clean Photo Details Online',
    seoDescription: 'Inspect photo EXIF details (camera model, exposure, date) and strip sensitive metadata for privacy online for free.',
    features: [
      'Detailed breakdown of photo camera settings',
      'Privacy stripper - download clean photo without EXIF',
      'View width, height, aspect ratio, color profile, and file details',
      '100% private - browser based'
    ],
    faqs: [
      {
        question: 'Why strip EXIF metadata?',
        answer: 'Photos taken on phones/cameras often store location data, timestamp, and device details. Stripping metadata protects your privacy.'
      }
    ]
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    slug: 'password-generator',
    path: '/password-generator',
    shortDescription: 'Create strong, random, uncrackable passwords with length, symbols, and bulk options.',
    fullDescription: 'Generate cryptographically strong passwords instantly in your browser. Control length, uppercase, lowercase, numbers, symbols, exclude similar characters, and export bulk password lists. Strength meter included. Nothing is stored or sent anywhere.',
    category: 'utility',
    icon: 'KeyRound',
    badge: 'Popular',
    isPopular: true,
    keywords: ['password generator', 'random password', 'strong password', 'secure password maker', 'bulk passwords'],
    seoTitle: 'Free Password Generator - Create Strong Random Passwords Online',
    seoDescription: 'Generate strong, random, secure passwords online for free. Custom length, symbols, bulk lists, and live strength meter. 100% private in your browser.',
    features: [
      'Cryptographically secure random generation',
      'Custom length from 6 to 128 characters',
      'Toggle uppercase, lowercase, numbers, and symbols',
      'Exclude look-alike characters (0/O, 1/l/I)',
      'Bulk generate and copy or download a list'
    ],
    faqs: [
      {
        question: 'Are generated passwords stored anywhere?',
        answer: 'No. Passwords are created locally with the Web Crypto API and never leave your device.'
      },
      {
        question: 'How strong is a 16-character password?',
        answer: 'A 16-character mix of letters, numbers, and symbols has trillions of combinations and is considered very strong for most accounts.'
      }
    ]
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    slug: 'word-counter',
    path: '/word-counter',
    shortDescription: 'Count words, characters, sentences, paragraphs, and reading time instantly.',
    fullDescription: 'Paste or type any text to get live word count, character count (with and without spaces), sentence and paragraph totals, keyword density, and estimated reading time. Perfect for essays, SEO copy, tweets, and social captions.',
    category: 'text',
    icon: 'WholeWord',
    badge: 'Popular',
    isPopular: true,
    keywords: ['word counter', 'character count', 'word count online', 'reading time calculator', 'essay word count'],
    seoTitle: 'Free Word Counter - Count Words, Characters & Reading Time',
    seoDescription: 'Free live word counter for essays, blogs, and social posts. Words, characters, sentences, paragraphs, keyword density, and reading time.',
    features: [
      'Live word, character, sentence, and paragraph counts',
      'Reading time estimate at 200 WPM',
      'Top keyword density list',
      'Copy stats or download as a text report',
      'Works entirely offline in your browser'
    ],
    faqs: [
      {
        question: 'How is reading time calculated?',
        answer: 'Reading time uses an average of 200 words per minute, which is standard for adult silent reading.'
      }
    ]
  },
  {
    id: 'pdf-word-counter',
    name: 'PDF Word Counter',
    slug: 'pdf-word-counter',
    path: '/pdf-word-counter',
    shortDescription: 'Extract text from a PDF and count words, characters, and pages privately.',
    fullDescription: 'Upload any PDF to extract its text and get an accurate word count, character count, page-by-page breakdown, and reading time. All extraction happens locally with PDF.js — your document never leaves the browser.',
    category: 'pdf',
    icon: 'FileSearch',
    badge: 'Essential',
    isPopular: true,
    keywords: ['pdf word count', 'count words in pdf', 'pdf character count', 'pdf text extractor', 'how many words in pdf'],
    seoTitle: 'Free PDF Word Counter - Count Words in a PDF Online',
    seoDescription: 'Count words and characters in any PDF online for free. Page-by-page breakdown, extracted text preview, 100% private browser processing.',
    features: [
      'Accurate word and character counts from PDF text',
      'Per-page word count breakdown',
      'Extracted text preview you can copy',
      'Reading time estimate',
      'No upload — processed only on your device'
    ],
    faqs: [
      {
        question: 'Does this work with scanned PDFs?',
        answer: 'Scanned image-only PDFs have no selectable text. Use the Image Word Counter (OCR) tool for photos or scanned pages.'
      }
    ]
  },
  {
    id: 'image-word-counter',
    name: 'Image Word Counter (OCR)',
    slug: 'image-word-counter',
    path: '/image-word-counter',
    shortDescription: 'Read text from a photo or screenshot and count the words automatically.',
    fullDescription: 'Upload a picture, screenshot, or scanned page. On-device OCR extracts the text, then you get word count, character count, and a copyable transcript. Great for posters, slides, receipts, and handwritten-style print.',
    category: 'image',
    icon: 'ScanText',
    badge: 'New',
    isPopular: true,
    keywords: ['image word count', 'ocr word counter', 'extract text from image', 'photo to text', 'count words in picture'],
    seoTitle: 'Free Image Word Counter - Count Words in a Picture with OCR',
    seoDescription: 'Count words in a photo or screenshot online for free. Client-side OCR extracts text, then shows word count and a copyable transcript.',
    features: [
      'OCR text extraction from JPG, PNG, and WebP',
      'Word, character, and line counts',
      'Editable extracted transcript',
      'Copy text or download as .txt',
      'Runs in the browser — no image upload to a server'
    ],
    faqs: [
      {
        question: 'How accurate is the OCR?',
        answer: 'Printed, high-contrast text is usually very accurate. Blurry photos, stylized fonts, or handwriting may need a quick edit in the transcript box.'
      }
    ]
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    slug: 'qr-code-generator',
    path: '/qr-code-generator',
    shortDescription: 'Create custom QR codes for URLs, Wi‑Fi, text, email, and phone numbers.',
    fullDescription: 'Turn any URL, text, Wi‑Fi login, email, or phone number into a high-resolution QR code. Customize size, colors, and error correction, then download as PNG. Generated locally — your data stays private.',
    category: 'utility',
    icon: 'QrCode',
    badge: 'Popular',
    isPopular: true,
    keywords: ['qr code generator', 'create qr code', 'wifi qr code', 'url to qr', 'free qr maker'],
    seoTitle: 'Free QR Code Generator - Create URL, Wi‑Fi & Text QR Codes',
    seoDescription: 'Generate custom QR codes for links, Wi‑Fi, email, and text online for free. Color and size controls, PNG download, 100% private.',
    features: [
      'URL, text, Wi‑Fi, email, and phone presets',
      'Custom colors and pixel size up to 1024px',
      'Error correction levels L/M/Q/H',
      'Instant PNG download',
      'No tracking or cloud storage'
    ],
    faqs: [
      {
        question: 'Can I make a Wi‑Fi QR code?',
        answer: 'Yes. Choose the Wi‑Fi type, enter the network name and password, and phones can join by scanning the code.'
      }
    ]
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    slug: 'json-formatter',
    path: '/json-formatter',
    shortDescription: 'Pretty-print, minify, and validate JSON with instant error highlighting.',
    fullDescription: 'Paste messy JSON to format it with indentation, minify it for production, or validate syntax with a clear error message and line hint. Copy or download the result. Ideal for APIs and config files.',
    category: 'utility',
    icon: 'Braces',
    badge: 'Fast',
    isPopular: false,
    keywords: ['json formatter', 'json validator', 'pretty print json', 'minify json', 'json beautifier'],
    seoTitle: 'Free JSON Formatter & Validator - Beautify and Minify JSON',
    seoDescription: 'Format, minify, and validate JSON online for free. Instant syntax errors, pretty print, and one-click copy. Private and fast.',
    features: [
      'Pretty-print with 2 or 4 space indent',
      'One-click minify',
      'Syntax validation with error message',
      'Copy formatted JSON or download a file',
      'Works offline in the browser'
    ],
    faqs: [
      {
        question: 'Is my JSON sent to a server?',
        answer: 'No. Parsing and formatting run entirely in JavaScript on your machine.'
      }
    ]
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    slug: 'case-converter',
    path: '/case-converter',
    shortDescription: 'Switch text between UPPER, lower, Title Case, camelCase, snake_case, and more.',
    fullDescription: 'Convert any text to uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, kebab-case, or alternating case in one click. Copy the result instantly.',
    category: 'text',
    icon: 'CaseSensitive',
    badge: 'Essential',
    isPopular: false,
    keywords: ['case converter', 'uppercase converter', 'title case', 'camelcase converter', 'snake case'],
    seoTitle: 'Free Case Converter - UPPER, Title, camelCase & snake_case',
    seoDescription: 'Convert text to uppercase, lowercase, title case, camelCase, snake_case, and kebab-case online for free.',
    features: [
      'Nine popular case styles',
      'Live preview as you type',
      'One-click copy',
      'Preserves or transforms spacing as needed'
    ],
    faqs: [
      {
        question: 'What is Title Case vs Sentence case?',
        answer: 'Title Case capitalizes each major word. Sentence case capitalizes only the first letter of each sentence.'
      }
    ]
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator (MD5, SHA)',
    slug: 'hash-generator',
    path: '/hash-generator',
    shortDescription: 'Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text or files.',
    fullDescription: 'Hash any string or file locally with SHA-1, SHA-256, SHA-384, or SHA-512 using the Web Crypto API. Compare checksums, copy hex output, and never upload the source.',
    category: 'utility',
    icon: 'Fingerprint',
    badge: 'PRO Free',
    isPopular: false,
    keywords: ['hash generator', 'sha256 online', 'file checksum', 'sha512 hash', 'md5 alternative'],
    seoTitle: 'Free Hash Generator - SHA-256, SHA-512 File & Text Checksums',
    seoDescription: 'Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text or files online for free. Private browser checksums.',
    features: [
      'SHA-1, SHA-256, SHA-384, SHA-512',
      'Hash text or any file',
      'Hex output with one-click copy',
      'Client-side Web Crypto — no uploads'
    ],
    faqs: [
      {
        question: 'Why is MD5 missing?',
        answer: 'MD5 is cryptographically broken. Modern browsers expose SHA family hashes via Web Crypto, which is what you should use for checksums.'
      }
    ]
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder & Decoder',
    slug: 'url-encoder',
    path: '/url-encoder',
    shortDescription: 'Encode or decode URL query strings, percent-encoding, and URI components.',
    fullDescription: 'Safely percent-encode or decode URLs and URI components. Switch between encodeURI and encodeURIComponent behavior, copy the result, and inspect special characters.',
    category: 'utility',
    icon: 'Link',
    badge: 'Fast',
    isPopular: false,
    keywords: ['url encoder', 'url decoder', 'percent encode', 'encodeuri', 'query string encoder'],
    seoTitle: 'Free URL Encoder & Decoder - Percent-Encode Query Strings',
    seoDescription: 'Encode and decode URLs and URI components online for free. encodeURI vs encodeURIComponent, instant copy.',
    features: [
      'Encode or decode in one click',
      'URI vs URI-component modes',
      'Handles spaces, unicode, and reserved characters',
      'Copy result instantly'
    ],
    faqs: [
      {
        question: 'When should I use encodeURIComponent?',
        answer: 'Use it for query values and path segments. Use encodeURI when encoding a full URL that should keep : / ? & intact.'
      }
    ]
  },
  {
    id: 'uuid-generator',
    name: 'UUID / GUID Generator',
    slug: 'uuid-generator',
    path: '/uuid-generator',
    shortDescription: 'Generate RFC 4122 version 4 UUIDs in bulk for databases, APIs, and keys.',
    fullDescription: 'Create one or hundreds of cryptographically random UUID v4 identifiers. Copy a single ID or download a list. Optional uppercase and hyphen-free formats.',
    category: 'utility',
    icon: 'Hash',
    badge: 'Fast',
    isPopular: false,
    keywords: ['uuid generator', 'guid generator', 'uuid v4', 'random uuid', 'bulk uuid'],
    seoTitle: 'Free UUID Generator - Create UUID v4 / GUID Online',
    seoDescription: 'Generate random RFC 4122 UUID v4 identifiers online for free. Bulk lists, uppercase, and hyphen-free formats.',
    features: [
      'Cryptographically random UUID v4',
      'Bulk generate up to 500 IDs',
      'Uppercase and no-hyphen options',
      'Copy all or download as .txt'
    ],
    faqs: [
      {
        question: 'Are these UUIDs unique?',
        answer: 'UUID v4 uses 122 random bits. Collisions are astronomically unlikely for normal application use.'
      }
    ]
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    slug: 'lorem-ipsum',
    path: '/lorem-ipsum',
    shortDescription: 'Generate placeholder paragraphs, sentences, or words for mockups and drafts.',
    fullDescription: 'Create classic Lorem Ipsum dummy text by paragraphs, sentences, or word count. Start with the traditional “Lorem ipsum dolor sit amet…” or randomize. Copy or download instantly.',
    category: 'text',
    icon: 'Type',
    badge: 'Essential',
    isPopular: false,
    keywords: ['lorem ipsum generator', 'dummy text', 'placeholder text', 'lipsum', 'fake paragraph generator'],
    seoTitle: 'Free Lorem Ipsum Generator - Dummy Paragraphs & Words',
    seoDescription: 'Generate Lorem Ipsum placeholder text by paragraphs, sentences, or words online for free. Copy or download.',
    features: [
      'Paragraphs, sentences, or exact word count',
      'Classic opening sentence option',
      'One-click copy and .txt download'
    ],
    faqs: [
      {
        question: 'What is Lorem Ipsum?',
        answer: 'It is scrambled Latin used as neutral placeholder copy so layout and typography can be judged without real content.'
      }
    ]
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    slug: 'unit-converter',
    path: '/unit-converter',
    shortDescription: 'Convert length, weight, temperature, data size, and time units instantly.',
    fullDescription: 'A clean all-in-one unit converter for length (px, cm, in, m, ft), weight (kg, lb, oz), temperature (C/F/K), digital storage (KB, MB, GB), and time. Type a value and see every related unit update live.',
    category: 'utility',
    icon: 'Ruler',
    badge: 'Essential',
    isPopular: false,
    keywords: ['unit converter', 'cm to inches', 'kg to lbs', 'celsius to fahrenheit', 'mb to gb'],
    seoTitle: 'Free Unit Converter - Length, Weight, Temperature & Data',
    seoDescription: 'Convert length, weight, temperature, data size, and time units online for free. Live two-way conversion.',
    features: [
      'Length, weight, temperature, data, and time',
      'Live conversion as you type',
      'Common web units including px and rem',
      'Copy any converted value'
    ],
    faqs: [
      {
        question: 'How are pixels converted?',
        answer: 'Pixels use the CSS reference of 96px = 1 inch. Actual screen size can vary by device density.'
      }
    ]
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    slug: 'color-converter',
    path: '/color-converter',
    shortDescription: 'Convert HEX, RGB, HSL, and HSV colors with a live preview swatch.',
    fullDescription: 'Pick a color or paste HEX, RGB, or HSL and get every format plus CSS snippets. Copy values, preview contrast on light and dark, and export a small palette.',
    category: 'utility',
    icon: 'Pipette',
    badge: 'New',
    isPopular: false,
    keywords: ['color converter', 'hex to rgb', 'rgb to hsl', 'hex color picker', 'css color converter'],
    seoTitle: 'Free Color Converter - HEX, RGB, HSL & HSV',
    seoDescription: 'Convert HEX, RGB, HSL, and HSV colors online for free. Live swatch, CSS snippets, and one-click copy.',
    features: [
      'HEX, RGB, HSL, and HSV in sync',
      'Visual color picker',
      'Copy CSS-ready snippets',
      'Light and dark preview tiles'
    ],
    faqs: [
      {
        question: 'Does this support 8-digit HEX with alpha?',
        answer: 'Yes. You can enter #RRGGBBAA and the RGB output will include an alpha channel.'
      }
    ]
  },
  {
    id: 'text-diff',
    name: 'Text Compare / Diff',
    slug: 'text-diff',
    path: '/text-diff',
    shortDescription: 'Compare two texts side by side and highlight added, removed, and changed lines.',
    fullDescription: 'Paste original and modified text to see a clear line-by-line diff. Added lines are green, removed lines are red. Useful for copy edits, code snippets, and legal wording.',
    category: 'text',
    icon: 'GitCompare',
    badge: 'New',
    isPopular: false,
    keywords: ['text compare', 'diff checker', 'compare two texts', 'online diff', 'find text changes'],
    seoTitle: 'Free Text Compare Tool - Diff Two Texts Online',
    seoDescription: 'Compare two blocks of text online for free. Line-by-line diff highlights additions and deletions privately in your browser.',
    features: [
      'Side-by-side original vs changed text',
      'Color-coded added and removed lines',
      'Ignore whitespace option',
      'Works with code, prose, and lists'
    ],
    faqs: [
      {
        question: 'Is this the same as git diff?',
        answer: 'It is a simplified line-level diff, perfect for documents and snippets. It does not produce a unified patch file.'
      }
    ]
  },
  {
    id: 'random-number',
    name: 'Random Number Generator',
    slug: 'random-number',
    path: '/random-number',
    shortDescription: 'Pick true random integers, decimals, or lists within any min/max range.',
    fullDescription: 'Generate one or many random numbers with custom min/max, integer or decimal places, unique-only lists, and optional sorting. Uses a cryptographic RNG when available.',
    category: 'utility',
    icon: 'Dices',
    badge: 'Fast',
    isPopular: false,
    keywords: ['random number generator', 'rng', 'random integer', 'pick a number', 'lottery number generator'],
    seoTitle: 'Free Random Number Generator - Integers, Decimals & Lists',
    seoDescription: 'Generate random numbers online for free. Custom range, unique lists, decimals, and cryptographic randomness.',
    features: [
      'Any min/max range',
      'Integers or fixed decimal places',
      'Bulk unique lists',
      'Copy or download results'
    ],
    faqs: [
      {
        question: 'Is this random enough for giveaways?',
        answer: 'Yes for casual draws. It uses crypto.getRandomValues when the browser supports it.'
      }
    ]
  }
];

// Normalize every tool's route into a Title-Case URL (e.g. /Word-Counter)
export const TOOLS_LIST: ToolItem[] = RAW_TOOLS.map((tool) => ({
  ...tool,
  path: toRoutePath(tool.slug),
}));

export const CATEGORIES = [
  { id: 'all', label: 'All Tools', icon: 'Grid', description: 'Explore every free all4 tool' },
  { id: 'pdf', label: 'PDF Tools', icon: 'FileText', description: 'Convert, merge, split, count, and edit PDF files' },
  { id: 'image', label: 'Image Tools', icon: 'Image', description: 'Resize, crop, compress, OCR, and extract colors' },
  { id: 'converter', label: 'Converters', icon: 'RefreshCw', description: 'Convert between PNG, JPG, WebP, SVG, and Text' },
  { id: 'text', label: 'Text Tools', icon: 'Type', description: 'Word count, case convert, lorem, and text compare' },
  { id: 'utility', label: 'Utilities', icon: 'Wrench', description: 'Passwords, QR codes, hashes, units, and developer tools' },
] as const;
