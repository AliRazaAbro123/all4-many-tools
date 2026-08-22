import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TOOLS_LIST } from './data/tools';
import { TOOL_COMPONENTS } from './components/tools';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToolLayout } from './components/common/ToolLayout';
import { HomeView } from './components/home/HomeView';

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
      localStorage.setItem('all4_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 bg-grid-pattern selection:bg-indigo-500 selection:text-white transition-colors duration-200">
        <Navbar favorites={favorites} toggleFavorite={toggleFavorite} />

        <div className="flex-1">
          <Routes>
            {/* Home Page Route */}
            <Route
              path="/"
              element={
                <HomeView favorites={favorites} toggleFavorite={toggleFavorite} />
              }
            />

            {/* Dynamic Individual Tool Routes */}
            {TOOLS_LIST.map((tool) => {
              const ToolComponent = TOOL_COMPONENTS[tool.id];
              if (!ToolComponent) return null;

              return (
                <Route
                  key={tool.id}
                  path={tool.path}
                  element={
                    <ToolLayout
                      tool={tool}
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                    >
                      <ToolComponent />
                    </ToolLayout>
                  }
                />
              );
            })}

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
