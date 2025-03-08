import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePropertyData } from '../context/DataContext';
import FilterPanel from '../components/filters/FilterPanel';
import PriceChart from '../components/visualizations/PriceChart';
import PropertyMap from '../components/visualizations/PropertyMap';

const HomePage = () => {
  const { stats, loading, error } = usePropertyData();
  const [activeTab, setActiveTab] = useState('overview'); // overview, map, analytics

  if (loading) {
    return (
      <div className="home-page loading-container">
        <div className="loading-animation">
          <div className="spinner"></div>
          <p>Kraunami NT rinkos duomenys...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page error-container">
        <h2>Nepavyko užkrauti duomenų</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Bandyti dar kartą</button>
      </div>
    );
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Lietuvos NT rinkos analitika</h1>
          <p>Išsamūs duomenys, statistika ir įžvalgos apie nekilnojamojo turto rinką Lietuvoje</p>
          
          <div className="hero-cta">
            <Link to="/map" className="cta-button">
              Žemėlapis
            </Link>
            <Link to="/analytics" className="cta-button secondary">
              Analizė
            </Link>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <h3>Vidutinė kaina</h3>
            <p className="stat-value">{Math.round(stats.avgPrice).toLocaleString()} €</p>
          </div>
          <div className="stat-card">
            <h3>Kaina už m²</h3>
            <p className="stat-value">{Math.round(stats.avgPricePerSqm).toLocaleString()} €/m²</p>
          </div>
          <div className="stat-card">
            <h3>Skelbimų</h3>
            <p className="stat-value">{stats.totalListings.toLocaleString()}</p>
          </div>
        </div>
      </section>

      <div className="home-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          Apžvalga
        </button>
        <button 
          className={activeTab === 'map' ? 'active' : ''} 
          onClick={() => setActiveTab('map')}
        >
          Žemėlapis
        </button>
        <button 
          className={activeTab === 'analytics' ? 'active' : ''} 
          onClick={() => setActiveTab('analytics')}
        >
          Statistika
        </button>
      </div>

      <div className="home-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <section className="filter-section">
              <h2>Filtruokite NT duomenis</h2>
              <FilterPanel />
            </section>

            <section className="market-overview">
              <h2>Rinkos apžvalga</h2>
              <div className="overview-grid">
                <div className="overview-card">
                  <h3>Kainų pasiskirstymas</h3>
                  <div className="chart-container">
                    <PriceChart chartType="bar" />
                  </div>
                </div>
                
                <div className="overview-card">
                  <h3>Populiariausi miestai</h3>
                  <div className="city-list">
                    {Object.entries(stats.cityDistribution || {})
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([city, count]) => (
                        <div key={city} className="city-item">
                          <span className="city-name">{city}</span>
                          <span className="city-count">{count} skelbimų</span>
                          <div className="city-bar">
                            <div 
                              className="city-bar-fill" 
                              style={{ width: `${(count / stats.totalListings) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="featured-properties">
              <h2>Naujausi NT skelbimai</h2>
              <div className="properties-grid">
                {/* Čia būtų atvaizduojami naujausi NT objektai */}
                <p className="placeholder-text">Skelbimai bus rodomi, kai bus prijungtas duomenų šaltinis.</p>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="map-content">
            <h2>NT objektai žemėlapyje</h2>
            <div className="map-container" style={{ height: '600px' }}>
              <PropertyMap />
            </div>
            <div className="map-instructions">
              <p>Spauskite ant žemėlapio taškų, kad pamatytumėte detalesnę informaciją apie NT objektus.</p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-content">
            <h2>NT rinkos statistika</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Kainų tendencijos</h3>
                <p>Grafikai bus rodomi, kai bus prijungtas duomenų šaltinis ir istoriniai duomenys.</p>
              </div>
              
              <div className="analytics-card">
                <h3>Rajonų palyginimas</h3>
                <p>Rajonų statistika bus rodoma, kai bus prijungtas duomenų šaltinis.</p>
              </div>
              
              <div className="analytics-card full-width">
                <h3>NT tipo pasiskirstymas</h3>
                <div className="property-type-stats">
                  <div className="property-type-item">
                    <span className="type-label">Butai</span>
                    <div className="type-bar">
                      <div className="type-bar-fill" style={{ width: '65%' }}></div>
                    </div>
                    <span className="type-percentage">65%</span>
                  </div>
                  <div className="property-type-item">
                    <span className="type-label">Namai</span>
                    <div className="type-bar">
                      <div className="type-bar-fill" style={{ width: '20%' }}></div>
                    </div>
                    <span className="type-percentage">20%</span>
                  </div>
                  <div className="property-type-item">
                    <span className="type-label">Sklypai</span>
                    <div className="type-bar">
                      <div className="type-bar-fill" style={{ width: '10%' }}></div>
                    </div>
                    <span className="type-percentage">10%</span>
                  </div>
                  <div className="property-type-item">
                    <span className="type-label">Komerciniai</span>
                    <div className="type-bar">
                      <div className="type-bar-fill" style={{ width: '5%' }}></div>
                    </div>
                    <span className="type-percentage">5%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="analytics-cta">
              <Link to="/analytics" className="cta-button">
                Detalesnė analizė
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;