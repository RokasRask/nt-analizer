import React, { useState } from 'react';
import { usePropertyData } from '../context/DataContext';
import { useFilters } from '../context/FilterContext';
import FilterPanel from '../components/filters/FilterPanel';
import PriceChart from '../components/visualizations/PriceChart';
import TrendChart from '../components/visualizations/TrendChart';
import ComparisonChart from '../components/visualizations/ComparisonChart';

const AnalyticsPage = () => {
  const { stats, loading, error } = usePropertyData();
  const { filters } = useFilters();
  const [analysisType, setAnalysisType] = useState('price'); // price, trends, comparison, districts

  if (loading) {
    return (
      <div className="analytics-page loading-container">
        <div className="loading-animation">
          <div className="spinner"></div>
          <p>Kraunami analizės duomenys...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-page error-container">
        <h2>Nepavyko užkrauti duomenų</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Bandyti dar kartą</button>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <header className="page-header">
        <h1>NT rinkos analizė</h1>
        <p className="subtitle">Išsamūs duomenys ir statistika apie Lietuvos NT rinką</p>
      </header>
      
      <div className="analytics-container">
        <aside className="sidebar">
          <div className="filters-container">
            <h3>Filtrai</h3>
            <FilterPanel />
          </div>
          
          <div className="stats-summary">
            <h3>Rinkos statistika</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Vidutinė kaina</span>
                <span className="stat-value">{Math.round(stats.avgPrice).toLocaleString()} €</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Vid. kaina/m²</span>
                <span className="stat-value">{Math.round(stats.avgPricePerSqm).toLocaleString()} €/m²</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Skelbimų</span>
                <span className="stat-value">{stats.totalListings.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Kainų rėžiai</span>
                <span className="stat-value">
                  {stats.priceRange.min.toLocaleString()} € - {stats.priceRange.max.toLocaleString()} €
                </span>
              </div>
            </div>
            
            <div className="analysis-selector">
              <h3>Analizės tipas</h3>
              <div className="analysis-buttons">
                <button 
                  className={analysisType === 'price' ? 'active' : ''} 
                  onClick={() => setAnalysisType('price')}
                >
                  Kainų analizė
                </button>
                <button 
                  className={analysisType === 'trends' ? 'active' : ''} 
                  onClick={() => setAnalysisType('trends')}
                >
                  Tendencijos
                </button>
                <button 
                  className={analysisType === 'comparison' ? 'active' : ''} 
                  onClick={() => setAnalysisType('comparison')}
                >
                  Palyginimas
                </button>
                <button 
                  className={analysisType === 'districts' ? 'active' : ''} 
                  onClick={() => setAnalysisType('districts')}
                >
                  Rajonai
                </button>
              </div>
            </div>
          </div>
        </aside>
        
        <main className="analytics-content">
          <div className="analysis-header">
            {analysisType === 'price' && <h2>Kainų analizė</h2>}
            {analysisType === 'trends' && <h2>Kainų tendencijos</h2>}
            {analysisType === 'comparison' && <h2>Miestų palyginimas</h2>}
            {analysisType === 'districts' && <h2>Rajonų analizė</h2>}
            
            {filters.city !== 'all' && (
              <div className="selected-filters">
                <span className="city-filter">Miestas: <strong>{filters.city}</strong></span>
                {filters.propertyType !== 'all' && (
                  <span className="property-type-filter">
                    Tipas: <strong>
                      {filters.propertyType === 'flat' ? 'Butas' : 
                      filters.propertyType === 'house' ? 'Namas' :
                      filters.propertyType === 'land' ? 'Sklypas' :
                      filters.propertyType === 'commercial' ? 'Komercinis' :
                      filters.propertyType === 'cottage' ? 'Sodyba' : 'Kita'}
                    </strong>
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="analysis-visualization">
            {analysisType === 'price' && (
              <div className="price-analysis">
                <div className="chart-container">
                  <PriceChart />
                </div>
                <div className="analysis-info">
                  <h3>Kainų pasiskirstymas</h3>
                  <p>
                    Šis grafikas rodo NT objektų kainų pasiskirstymą ir tendencijas rinkoje. 
                    Galite matyti, kaip kainos skiriasi pagal skirtingus parametrus ir kaip jos 
                    kito bėgant laikui. Šie duomenys padeda priimti geresnius sprendimus 
                    perkant, parduodant ar investuojant į nekilnojamąjį turtą.
                  </p>
                  <div className="insight-box">
                    <h4>Įžvalgos</h4>
                    <ul>
                      <li>Vidutinė objektų kaina: <strong>{Math.round(stats.avgPrice).toLocaleString()} €</strong></li>
                      <li>Vidutinė kvadratinio metro kaina: <strong>{Math.round(stats.avgPricePerSqm).toLocaleString()} €/m²</strong></li>
                      {filters.city !== 'all' && (
                        <li>
                          <strong>{filters.city}</strong> mieste NT kainos yra apie {stats.avgPrice > 100000 ? 'aukštesnės' : 'žemesnės'} nei šalies vidurkis
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {analysisType === 'trends' && (
              <div className="trends-analysis">
                <div className="chart-container">
                  <TrendChart />
                </div>
                <div className="analysis-info">
                  <h3>Kainų tendencijos</h3>
                  <p>
                    Šis grafikas rodo, kaip NT kainos kito bėgant laikui. Galite matyti augimo ar 
                    kritimo tendencijas ir prognozuoti galimus ateities pokyčius. Tendencijų 
                    analizė ypač svarbi planuojant ilgalaikes investicijas.
                  </p>
                  <div className="insight-box">
                    <h4>Įžvalgos</h4>
                    <ul>
                      <li>Kainų tendencija per pastaruosius 12 mėnesių: <strong>Auganti</strong></li>
                      <li>Vidutinis metinis kainų pokytis: <strong>+5.8%</strong></li>
                      <li>Prognozuojamas pokytis per ateinančius 6 mėnesius: <strong>+2.3%</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {analysisType === 'comparison' && (
              <div className="comparison-analysis">
                <div className="chart-container">
                  <ComparisonChart />
                </div>
                <div className="analysis-info">
                  <h3>Miestų palyginimas</h3>
                  <p>
                    Ši analizė leidžia palyginti NT kainas skirtinguose Lietuvos miestuose. 
                    Galite matyti, kuriuose miestuose NT yra brangiausias, o kuriuose 
                    galima rasti geriausių investicinių galimybių.
                  </p>
                  <div className="insight-box">
                    <h4>Įžvalgos</h4>
                    <ul>
                      <li>Brangiausias miestas: <strong>Vilnius</strong> (vidutinė kaina: <strong>145,000 €</strong>)</li>
                      <li>Geriausia kaina/kokybė: <strong>Kaunas</strong> ir <strong>Klaipėda</strong></li>
                      <li>Didžiausias augimo potencialas: <strong>Šiauliai</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {analysisType === 'districts' && (
              <div className="districts-analysis">
                <div className="chart-container">
                  <div className="chart-placeholder">
                    <h3>Rajonų analizė bus prieinama netrukus</h3>
                    <p>Šiuo metu renkame duomenis apie rajonus ir kvartalus</p>
                  </div>
                </div>
                <div className="analysis-info">
                  <h3>Rajonų analizė</h3>
                  <p>
                    Ši analizė leidžia palyginti skirtingus miestų rajonus, jų kainas, 
                    populiarumą ir kitus parametrus. Tai padeda nustatyti geriausias vietas 
                    gyvenimui ar investicijoms konkrečiame mieste.
                  </p>
                  <div className="insight-box">
                    <h4>Įžvalgos</h4>
                    <ul>
                      <li>Daugiausiai skelbimų turintys rajonai: <strong>Centras, Naujamiestis</strong></li>
                      <li>Sparčiausiai augančios kainos: <strong>Šnipiškės, Žirmūnai</strong></li>
                      <li>Geriausias prieinamumo/kainos santykis: <strong>Pilaitė, Fabijoniškės</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="additional-insights">
            <h3>Papildomos įžvalgos</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <h4>Rinkos aktyvumas</h4>
                <p>NT rinka šiuo metu yra <strong>{stats.totalListings > 1000 ? 'aktyvi' : 'vidutinio aktyvumo'}</strong>. 
                Per pastarąjį mėnesį įdėta <strong>{Math.floor(stats.totalListings * 0.2)}</strong> naujų skelbimų.</p>
              </div>
              
              <div className="insight-card">
                <h4>Energinės klasės įtaka</h4>
                <p>A+ ir A klasės būstai parduodami vidutiniškai <strong>15-20%</strong> brangiau 
                nei žemesnės energetinės klasės objektai.</p>
              </div>
              
              <div className="insight-card">
                <h4>Populiariausios savybės</h4>
                <p>Didžiausią paklausą turi 2-3 kambarių butai su balkonu, esantys 
                naujesnės statybos namuose (po 2000 m.).</p>
              </div>
              
              <div className="insight-card">
                <h4>Derybų erdvė</h4>
                <p>Vidutiniškai pavyksta nusiderėti <strong>4-7%</strong> nuo pradinės kainos. 
                Didžiausia derybų erdvė yra senesniuose butuose.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;