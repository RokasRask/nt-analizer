import React, { useState, useEffect } from 'react';
import { usePropertyData } from '../context/DataContext';
import ComparisonChart from '../components/visualizations/ComparisonChart';

const ComparisonPage = () => {
  const { loading, error } = usePropertyData();
  const [selectedCities, setSelectedCities] = useState(['Vilnius', 'Kaunas', 'Klaipėda']);
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [comparisonMetric, setComparisonMetric] = useState('avgPrice');
  const [chartType, setChartType] = useState('bar'); // bar, radar, line

  // Miestų sąrašas
  const allCities = [
    'Vilnius',
    'Kaunas',
    'Klaipėda',
    'Šiauliai',
    'Panevėžys',
    'Alytus',
    'Marijampolė',
    'Mažeikiai',
    'Jonava',
    'Utena'
  ];

  // NT tipų sąrašas
  const propertyTypes = [
    { value: 'all', label: 'Visi tipai' },
    { value: 'flat', label: 'Butai' },
    { value: 'house', label: 'Namai' },
    { value: 'land', label: 'Sklypai' },
    { value: 'commercial', label: 'Komerciniai' }
  ];

  // Palyginimo metrikų sąrašas
  const comparisonMetrics = [
    { value: 'avgPrice', label: 'Vidutinė kaina' },
    { value: 'avgPricePerSqm', label: 'Kaina už m²' },
    { value: 'count', label: 'Skelbimų skaičius' },
    { value: 'priceGrowth', label: 'Kainų augimas (%)' },
    { value: 'affordabilityIndex', label: 'Įperkamumo indeksas' }
  ];

  // Miesto žymėjimo funkcija
  const handleCityToggle = (city) => {
    if (selectedCities.includes(city)) {
      // Jei jau pažymėtas, pašaliname (bet paliekame bent vieną)
      if (selectedCities.length > 1) {
        setSelectedCities(selectedCities.filter(c => c !== city));
      }
    } else {
      // Pridedame miestą
      setSelectedCities([...selectedCities, city]);
    }
  };

  if (loading) {
    return (
      <div className="comparison-page loading-container">
        <div className="loading-animation">
          <div className="spinner"></div>
          <p>Kraunami palyginimo duomenys...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comparison-page error-container">
        <h2>Nepavyko užkrauti duomenų</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Bandyti dar kartą</button>
      </div>
    );
  }

  return (
    <div className="comparison-page">
      <header className="page-header">
        <h1>Miestų palyginimas</h1>
        <p className="subtitle">Palyginkite skirtingų Lietuvos miestų nekilnojamojo turto rodiklius</p>
      </header>

      <div className="comparison-container">
        <div className="comparison-options">
          <div className="comparison-filters">
            <div className="filter-group">
              <label>Pasirinkite miestus:</label>
              <div className="city-checkboxes">
                {allCities.map(city => (
                  <label key={city} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedCities.includes(city)}
                      onChange={() => handleCityToggle(city)}
                      disabled={selectedCities.length === 1 && selectedCities.includes(city)}
                    />
                    <span>{city}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label htmlFor="property-type">NT tipas:</label>
              <select 
                id="property-type" 
                value={selectedPropertyType}
                onChange={(e) => setSelectedPropertyType(e.target.value)}
                className="filter-select"
              >
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="comparison-metric">Palyginimo kriterijus:</label>
              <select 
                id="comparison-metric" 
                value={comparisonMetric}
                onChange={(e) => setComparisonMetric(e.target.value)}
                className="filter-select"
              >
                {comparisonMetrics.map(metric => (
                  <option key={metric.value} value={metric.value}>
                    {metric.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Diagramos tipas:</label>
              <div className="chart-type-buttons">
                <button 
                  className={chartType === 'bar' ? 'active' : ''} 
                  onClick={() => setChartType('bar')}
                >
                  Stulpelinė
                </button>
                <button 
                  className={chartType === 'line' ? 'active' : ''} 
                  onClick={() => setChartType('line')}
                >
                  Linijinė
                </button>
                <button 
                  className={chartType === 'radar' ? 'active' : ''} 
                  onClick={() => setChartType('radar')}
                >
                  Radaro
                </button>
              </div>
            </div>
          </div>

          <div className="comparison-chart-container">
            <h2>
              {comparisonMetrics.find(m => m.value === comparisonMetric)?.label} pagal miestus
              {selectedPropertyType !== 'all' && (
                <span className="property-type-filter">
                  {' - '}
                  {propertyTypes.find(t => t.value === selectedPropertyType)?.label}
                </span>
              )}
            </h2>
            
            <div className="chart-container">
              <ComparisonChart 
                cities={selectedCities}
                propertyType={selectedPropertyType}
                metric={comparisonMetric}
                chartType={chartType}
              />
            </div>
            
            <div className="chart-explanation">
              <p>
                Šis grafikas leidžia palyginti {comparisonMetrics.find(m => m.value === comparisonMetric)?.label.toLowerCase()} 
                tarp skirtingų Lietuvos miestų. Galite keisti rodiklius, NT tipą ir miestus, 
                kad gautumėte jus dominančią informaciją.
              </p>
            </div>
          </div>
        </div>

        <div className="comparison-insights">
          <h2>Pagrindinės įžvalgos</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <h3>Vidutinių kainų skirtumai</h3>
              <p>
                Didžiausios nekilnojamojo turto kainos yra Vilniuje, kur butų kainos yra apie 
                30-40% aukštesnės nei Kaune ir 50-60% aukštesnės nei kituose didžiuosiuose miestuose.
              </p>
            </div>
            
            <div className="insight-card">
              <h3>Kainų tendencijos</h3>
              <p>
                Pastaruosius metus stebimas nuosaikus NT kainų augimas visuose didžiuosiuose miestuose. 
                Sparčiausiai kainos auga Vilniuje ir Klaipėdoje.
              </p>
            </div>
            
            <div className="insight-card">
              <h3>Įperkamumo indeksas</h3>
              <p>
                Nors kainos Vilniuje aukščiausios, atsižvelgiant į vidutinį atlyginimą, įperkamumo 
                indeksas rodo, kad aukštesnės pajamos iš dalies kompensuoja kainų skirtumą.
              </p>
            </div>
            
            <div className="insight-card">
              <h3>Regioniniai skirtumai</h3>
              <p>
                Mažesniuose miestuose NT kainos gali būti net 2-3 kartus žemesnės nei sostinėje, 
                tačiau ten taip pat mažesnė NT objektų pasiūla ir mažesnis rinkos aktyvumas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;