import { useState, useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { TOOLS_LIST } from './data/tools';
import { TOOL_COMPONENTS } from './components/tools';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToolLayout } from './components/common/ToolLayout';
import { HomeView } from './components/home/HomeView';


// =====================================================
// WEBSITE SEO CONFIGURATION
// =====================================================

const SITE_NAME = 'All4Tools';
const SITE_URL = 'https://all4.vercel.app';

// Change this to your real website URL
const DEFAULT_DESCRIPTION =
  'Free online tools for images, PDFs, text, files and productivity. Fast, easy and free tools with no complicated setup.';


// =====================================================
// SEO COMPONENT
// =====================================================

function SEO({
  title,
  description,
  path = '/',
  type = 'website',
}: {
  title: string;
  description: string;
  path?: string;
  type?: string;
}) {
  const canonicalUrl = `${SITE_URL}${path}`;

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />

      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />

      <meta
        name="googlebot"
        content="index, follow"
      />

      <link
        rel="canonical"
        href={canonicalUrl}
      />

      {/* Open Graph */}
      <meta property="og:type" content={type} />

      <meta
        property="og:title"
        content={title}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:url"
        content={canonicalUrl}
      />

      <meta
        property="og:site_name"
        content={SITE_NAME}
      />

      <meta
        property="og:locale"
        content="en_US"
      />

      {/* Twitter / X */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={title}
      />

      <meta
        name="twitter:description"
        content={description}
      />

      {/* Theme */}
      <meta
        name="theme-color"
        content="#020617"
      />
    </Helmet>
  );
}


// =====================================================
// HOME PAGE SEO
// =====================================================

function HomeSEO() {
  return (
    <Helmet>
      <title>
        {SITE_NAME} - Free Online Tools for PDF, Images, Text & More
      </title>

      <meta
        name="description"
        content="Use free online tools for PDF, images, text, files and productivity. Convert, resize, compress, generate and edit files quickly with All4Tools."
      />

      <meta
        name="keywords"
        content="free online tools, PDF tools, image tools, image converter, PDF converter, image resizer, password generator, QR code generator, word counter, JSON formatter, free tools"
      />

      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />

      <link
        rel="canonical"
        href={SITE_URL}
      />

      {/* Open Graph */}
      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:title"
        content={`${SITE_NAME} - Free Online Tools`}
      />

      <meta
        property="og:description"
        content="Free online tools for PDF, images, text, files and everyday productivity."
      />

      <meta
        property="og:url"
        content={SITE_URL}
      />

      <meta
        property="og:site_name"
        content={SITE_NAME}
      />

      {/* Twitter */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={`${SITE_NAME} - Free Online Tools`}
      />

      <meta
        name="twitter:description"
        content="Free online tools for PDF, images, text, files and productivity."
      />

      {/* Website Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL,
          description: DEFAULT_DESCRIPTION,
        })}
      </script>

      {/* Organization Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
        })}
      </script>
    </Helmet>
  );
}


// =====================================================
// INDIVIDUAL TOOL SEO
// =====================================================

function ToolSEO({ tool }: { tool: any }) {
  const toolName =
    tool.name ||
    tool.title ||
    tool.label ||
    'Free Online Tool';

  const rawDescription =
    tool.description ||
    `Use our free ${toolName} online. Fast, easy and free to use.`;

  const description =
    rawDescription.length > 155
      ? rawDescription.substring(0, 152) + '...'
      : rawDescription;

  const toolPath = tool.path || `/tools/${tool.id}`;

  const keywords = [
    toolName,
    `free ${toolName}`,
    `${toolName} online`,
    `online ${toolName}`,
    `free online tools`,
    'free tools',
    'online tools',
  ].join(', ');

  const canonicalUrl = `${SITE_URL}${toolPath}`;

  return (
    <Helmet>
      {/* ================= BASIC SEO ================= */}

      <title>
        {toolName} - Free Online Tool | {SITE_NAME}
      </title>

      <meta
        name="description"
        content={description}
      />

      <meta
        name="keywords"
        content={keywords}
      />

      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />

      <meta
        name="googlebot"
        content="index, follow"
      />

      <link
        rel="canonical"
        href={canonicalUrl}
      />

      {/* ================= OPEN GRAPH ================= */}

      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:title"
        content={`${toolName} - Free Online Tool`}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:url"
        content={canonicalUrl}
      />

      <meta
        property="og:site_name"
        content={SITE_NAME}
      />

      {/* ================= TWITTER ================= */}

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={`${toolName} - Free Online Tool`}
      />

      <meta
        name="twitter:description"
        content={description}
      />

      {/* ================= SOFTWARE APPLICATION SCHEMA ================= */}

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',

          name: toolName,

          description: description,

          url: canonicalUrl,

          applicationCategory:
            'UtilitiesApplication',

          operatingSystem:
            'All',

          browserRequirements:
            'Requires JavaScript',

          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },

          isAccessibleForFree: true,

          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
          },
        })}
      </script>

      {/* ================= BREADCRUMB SCHEMA ================= */}

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',

          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: SITE_URL,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: toolName,
              item: canonicalUrl,
            },
          ],
        })}
      </script>
    </Helmet>
  );
}


// =====================================================
// MAIN APP
// =====================================================

export function App() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('all4_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        'all4_favorites',
        JSON.stringify(favorites)
      );
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(
        favorites.filter((f) => f !== id)
      );
    } else {
      setFavorites([
        ...favorites,
        id,
      ]);
    }
  };

  return (
    <HelmetProvider>
      <BrowserRouter>

        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 bg-grid-pattern selection:bg-indigo-500 selection:text-white transition-colors duration-200">

          <Navbar
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />

          <div className="flex-1">

            <Routes>

              {/* =====================================
                  HOME PAGE
              ===================================== */}

              <Route
                path="/"
                element={
                  <>
                    <HomeSEO />

                    <HomeView
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                    />
                  </>
                }
              />


              {/* =====================================
                  ALL TOOL PAGES
              ===================================== */}

              {TOOLS_LIST.map((tool) => {

                const ToolComponent =
                  TOOL_COMPONENTS[tool.id];

                if (!ToolComponent) return null;

                return (
                  <Route
                    key={tool.id}
                    path={tool.path}
                    element={
                      <>
                        {/* Dynamic SEO */}
                        <ToolSEO tool={tool} />

                        <ToolLayout
                          tool={tool}
                          favorites={favorites}
                          toggleFavorite={
                            toggleFavorite
                          }
                        >
                          <ToolComponent />
                        </ToolLayout>
                      </>
                    }
                  />
                );
              })}


              {/* =====================================
                  404 FALLBACK
              ===================================== */}

              <Route
                path="*"
                element={
                  <Navigate
                    to="/"
                    replace
                  />
                }
              />

            </Routes>

          </div>

          <Footer />

        </div>

      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
