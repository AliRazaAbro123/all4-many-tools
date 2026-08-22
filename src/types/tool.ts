export type ToolCategory = 'all' | 'pdf' | 'image' | 'converter' | 'text' | 'utility';

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolItem {
  id: string;
  name: string;
  slug: string;
  path: string;
  shortDescription: string;
  fullDescription: string;
  category: ToolCategory;
  icon: string;
  badge?: 'Popular' | 'Essential' | 'Fast' | 'New' | 'PRO Free';
  keywords: string[];
  seoTitle: string;
  seoDescription: string;
  features: string[];
  faqs: ToolFAQ[];
  isPopular?: boolean;
}
