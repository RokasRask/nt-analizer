import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePropertyData } from '../context/DataContext';
import PriceChart from '../components/visualizations/PriceChart';
import PropertyMap from '../components/visualizations/PropertyMap';
import './HomePage.scss';

const HomePage = () => {
  const { stats, loading, error } = usePropertyData();
  const [activeTab, setActiveTab] = useState('overview'); // overview, map, analytics
  const [searchType, setSearchType] = useState('buy'); // buy, rent, invest

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
        <div className="hero-container">
          <div className="hero-content">
            <h1>Lietuvos NT rinkos analitika</h1>
            <p>Išsamūs duomenys, statistika ir įžvalgos apie nekilnojamojo turto rinką Lietuvoje. Priimkite geresnius sprendimus perkant, parduodant ar investuojant į NT.</p>
            
            <div className="hero-cta">
              <Link to="/map" className="cta-button primary">
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
          
          <div className="scroll-down">
            <a href="#search-section" aria-label="Slinkti žemyn"></a>
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
            <section id="search-section" className="search-section">
              <div className="section-title">
                <h2>Ieškokite NT objektų</h2>
                <p>Naudokite mūsų pažangius filtrus geriausiam nekilnojamam turtui rasti</p>
              </div>
              
              <div className="search-container">
                <div className="search-tabs">
                  <button 
                    className={searchType === 'buy' ? 'active' : ''} 
                    onClick={() => setSearchType('buy')}
                  >
                    Pirkti
                  </button>
                  <button 
                    className={searchType === 'rent' ? 'active' : ''} 
                    onClick={() => setSearchType('rent')}
                  >
                    Nuomotis
                  </button>
                  <button 
                    className={searchType === 'invest' ? 'active' : ''} 
                    onClick={() => setSearchType('invest')}
                  >
                    Investuoti
                  </button>
                </div>
                
                <form className="search-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="property-type">NT tipas</label>
                      <select id="property-type">
                        <option value="all">Visi tipai</option>
                        <option value="flat">Butai</option>
                        <option value="house">Namai</option>
                        <option value="land">Sklypai</option>
                        <option value="commercial">Komercinės patalpos</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="location">Vietovė</label>
                      <select id="location">
                        <option value="all">Visa Lietuva</option>
                        <option value="vilnius">Vilnius</option>
                        <option value="kaunas">Kaunas</option>
                        <option value="klaipeda">Klaipėda</option>
                        <option value="siauliai">Šiauliai</option>
                        <option value="panevezys">Panevėžys</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="price-min">Kaina nuo</label>
                      <input type="number" id="price-min" placeholder="Min. kaina" />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="price-max">Kaina iki</label>
                      <input type="number" id="price-max" placeholder="Max. kaina" />
                    </div>
                  </div>
                  
                  <button type="submit" className="search-button">
                    <i className="fas fa-search"></i> Ieškoti
                  </button>
                </form>
              </div>
            </section>

            <section className="features-section">
              <div className="section-title">
                <h2>Analizuokite NT rinką</h2>
                <p>Mūsų platforma siūlo įvairius įrankius, padėsiančius suprasti NT rinką</p>
              </div>
              
              <div className="features-container">
                <div className="feature-card">
                  <div className="feature-icon">
                    <img src="../assets/images/feature-icon-search.svg" alt="Paieška" />
                  </div>
                  <h3>Išplėstinė paieška</h3>
                  <p>Naudokite detalius filtrus, kad rastumėte būtent tai, ko ieškote. Filtruokite pagal kainą, vietą, dydį ir kitus parametrus.</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">
                    <img src="../assets/images/feature-icon-analytics.svg" alt="Analizė" />
                  </div>
                  <h3>Rinkos analizė</h3>
                  <p>Gaukite išsamią NT rinkos analizę su kainų tendencijomis, palyginimais ir prognozėmis.</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">
                    <img src="../assets/images/feature-icon-map.svg" alt="Žemėlapis" />
                  </div>
                  <h3>Interaktyvus žemėlapis</h3>
                  <p>Tyrinėkite NT objektus interaktyviame žemėlapyje su galingais filtravimo įrankiais.</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">
                    <img src="../assets/images/feature-icon-compare.svg" alt="Palyginimai" />
                  </div>
                  <h3>Miestų palyginimas</h3>
                  <p>Palyginkite skirtingų Lietuvos miestų ir rajonų NT kainas, tendencijas ir kitus parametrus.</p>
                </div>
              </div>
            </section>

            <section className="stats-section">
              <div className="stats-container">
                <div className="stat-item">
                  <div className="stat-number">15000</div>
                  <div className="stat-label">NT objektų duomenų bazėje</div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-number">5</div>
                  <div className="stat-label">Didžiausi Lietuvos miestai</div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-number">98</div>
                  <div className="stat-label">Patenkintų vartotojų</div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-number">24</div>
                  <div className="stat-label">Valandų duomenų atnaujinimas</div>
                </div>
              </div>
            </section>
            
            <section className="latest-listings-section">
              <div className="section-title">
                <h2>Naujausi NT skelbimai</h2>
                <p>Peržiūrėkite naujausius NT skelbimus iš visos Lietuvos</p>
              </div>
              
              <div className="listings-container">
                {/* Čia galėtų būti realūs NT objektai, bet dabar naudosime placeholder'ius */}
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <div key={index} className="property-card">
                    <div className="property-image">
                      <div className="property-label">Naujas</div>
                      <img src={`/assets/images/property-placeholder-${index}.jpg`} alt={`NT objektas ${index}`} />
                      <div className="property-price">145,000 €</div>
                    </div>
                    <div className="property-details">
                      <h3>3 kambarių butas centre</h3>
                      <div className="property-location">
                        <i className="fas fa-map-marker-alt"></i>
                        Vilnius, Naujamiestis
                      </div>
                      <div className="property-features">
                        <div className="feature">
                          <i className="fas fa-vector-square"></i>
                          65 m²
                        </div>
                        <div className="feature">
                          <i className="fas fa-bed"></i>
                          3 kamb.
                        </div>
                        <div className="feature">
                          <i className="fas fa-building"></i>
                          3/5 aukšt.
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link to="/map" className="view-all-button">
                Visi skelbimai
              </Link>
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
              <Link to="/map" className="view-more-button">
                Išplėstinis žemėlapis
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-content">
            <h2>NT rinkos statistika</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Kainų tendencijos</h3>
                <div className="chart-container">
                  <PriceChart />
                </div>
              </div>
              
              <div className="analytics-card full-width">
                <h3>Miestų palyginimas</h3>
                <p>Palyginkite NT kainas skirtinguose Lietuvos miestuose</p>
                <div className="city-comparison">
                  <div className="city-bar-container">
                    <div className="city-label">Vilnius</div>
                    <div className="city-bar">
                      <div className="city-bar-fill" style={{ width: '100%' }}></div>
                      <span className="city-value">2,345 €/m²</span>
                    </div>
                  </div>
                  
                  <div className="city-bar-container">
                    <div className="city-label">Kaunas</div>
                    <div className="city-bar">
                      <div className="city-bar-fill" style={{ width: '75%' }}></div>
                      <span className="city-value">1,768 €/m²</span>
                    </div>
                  </div>
                  
                  <div className="city-bar-container">
                    <div className="city-label">Klaipėda</div>
                    <div className="city-bar">
                      <div className="city-bar-fill" style={{ width: '62%' }}></div>
                      <span className="city-value">1,450 €/m²</span>
                    </div>
                  </div>
                  
                  <div className="city-bar-container">
                    <div className="city-label">Šiauliai</div>
                    <div className="city-bar">
                      <div className="city-bar-fill" style={{ width: '40%' }}></div>
                      <span className="city-value">950 €/m²</span>
                    </div>
                  </div>
                  
                  <div className="city-bar-container">
                    <div className="city-label">Panevėžys</div>
                    <div className="city-bar">
                      <div className="city-bar-fill" style={{ width: '38%' }}></div>
                      <span className="city-value">890 €/m²</span>
                    </div>
                  </div>
                </div>
                
                <Link to="/comparison" className="view-more-button">
                  Detali analizė
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;