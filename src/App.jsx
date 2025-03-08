import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FilterProvider } from './context/FilterContext';
import { DataProvider } from './context/DataContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import AnalyticsPage from './pages/AnalyticsPage';
import MapPage from './pages/MapPage';
import ComparisonPage from './pages/ComparisonPage';
import AboutPage from './pages/AboutPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import './styles/global.css';

function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <FilterProvider>
          <Router>
            <div className="app-container">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/comparison" element={<ComparisonPage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </FilterProvider>
      </DataProvider>
    </ErrorBoundary>
  );
}

export default App;