import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ToolItem } from '../../types/tool';

interface SEOHeadProps {
  tool?: ToolItem;
  customTitle?: string;
  customDescription?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  tool,
  customTitle,
  customDescription,
}) => {
  const location = useLocation();

  const title = tool
    ? `${tool.seoTitle} | all4`
    : customTitle
    ? `${customTitle} | all4`
    : 'all4 - Free Online PDF, Image, Text & Utility Tools';

  const description = tool
    ? tool.seoDescription
    : customDescription
    ? customDescription
      : 'all4 is a free private browser toolkit: PDF to image, image to PDF, password generator, word counter, QR codes, converters, and more. Zero file uploads.';

  const fullUrl = `https://all4.app${location.pathname}`;

  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Update OpenGraph Tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', fullUrl);

    // 4. Update JSON-LD Structured Data for SEO
    let scriptTag = document.getElementById('json-ld-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-schema';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }

    const schemaData = tool
      ? {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: tool.name,
          description: tool.fullDescription,
          url: fullUrl,
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'All',
          offers: {
            '@type': 'Offer',
            price: '0.00',
            priceCurrency: 'USD',
          },
          featureList: tool.features,
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'all4',
          url: 'https://all4.app',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://all4.app/?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        };

    scriptTag.textContent = JSON.stringify(schemaData);

    // Scroll to top on navigation change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [title, description, fullUrl, tool]);

  return null;
};
