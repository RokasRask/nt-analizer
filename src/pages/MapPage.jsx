import React, { useState } from 'react';
import { usePropertyData } from '../context/DataContext';
import { useFilters } from '../context/FilterContext';
import FilterPanel from '../components/filters/FilterPanel';
import PropertyMap from '../components/visualizations/PropertyMap';

const MapPage = () => {
  const { properties, loading, error, stats } = usePropertyData();
  const { filters } = useFilters();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // map, heatmap, clusters

  // Apdoroja žemėlapio objekto pasirinkimą
  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
  };

  if (loading) {
    return (
      <div className="map-page loading-container">
        <div className="loading-animation">
          <div className="spinner"></div>
          <p>Kraunami žemėlapio duomenys...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-page error-container">
        <h2>Nepavyko užkrauti duomenų</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Bandyti dar kartą</button>
      </div>
    );
  }

  return (
    <div className="map-page">
      <header className="page-header">
        <h1>NT objektų žemėlapis</h1>
        <p className="subtitle">Vizualizuokite nekilnojamojo turto skelbimus geografiškai</p>
      </header>
      
      <div className="map-container">
        <aside className="sidebar">
          <div className="filters-container">
            <h3>Filtrai</h3>
            <FilterPanel />
          </div>
          
          <div className="map-controls">
            <h3>Žemėlapio režimas</h3>
            <div className="view-mode-buttons">
              <button 
                className={viewMode === 'map' ? 'active' : ''} 
                onClick={() => setViewMode('map')}
              >
                Standartinis
              </button>
              <button 
                className={viewMode === 'heatmap' ? 'active' : ''} 
                onClick={() => setViewMode('heatmap')}
              >
                Šilumos žemėlapis
              </button>
              <button 
                className={viewMode === 'clusters' ? 'active' : ''} 
                onClick={() => setViewMode('clusters')}
              >
                Grupavimas
              </button>
            </div>
            
            <div className="map-legend">
              <h4>Spalvų reikšmės</h4>
              <div className="legend-items">
                <div className="legend-item">
                  <div className="color-box low-price"></div>
                  <span>Žemesnė kaina</span>
                </div>
                <div className="legend-item">
                  <div className="color-box medium-price"></div>
                  <span>Vidutinė kaina</span>
                </div>
                <div className="legend-item">
                  <div className="color-box high-price"></div>
                  <span>Aukštesnė kaina</span>
                </div>
              </div>
            </div>
          </div>
          
          {selectedProperty && (
            <div className="selected-property-details">
              <h3>Pasirinkto objekto informacija</h3>
              <div className="property-card">
                <h4>{selectedProperty.title}</h4>
                <p className="property-price">{selectedProperty.price.toLocaleString()} €</p>
                <p className="property-price-sqm">
                  {Math.round(selectedProperty.price / selectedProperty.area).toLocaleString()} €/m²
                </p>
                <div className="property-details">
                  <p><strong>Plotas:</strong> {selectedProperty.area} m²</p>
                  {selectedProperty.rooms && (
                    <p><strong>Kambariai:</strong> {selectedProperty.rooms}</p>
                  )}
                  <p><strong>Rajonas:</strong> {selectedProperty.district || 'Nenurodyta'}</p>
                  {selectedProperty.buildYear && (
                    <p><strong>Statybos metai:</strong> {selectedProperty.buildYear}</p>
                  )}
                  <p><strong>Tipas:</strong> {
                    selectedProperty.propertyType === 'flat' ? 'Butas' : 
                    selectedProperty.propertyType === 'house' ? 'Namas' :
                    selectedProperty.propertyType === 'land' ? 'Sklypas' :
                    selectedProperty.propertyType === 'commercial' ? 'Komercinis' :
                    selectedProperty.propertyType === 'cottage' ? 'Sodyba' : 'Kita'
                  }</p>
                </div>
                {selectedProperty.url && (
                  <a 
                    href={selectedProperty.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="view-listing-btn"
                  >
                    Peržiūrėti skelbimą
                  </a>
                )}
              </div>
            </div>
          )}
        </aside>
        
        <main className="map-content">
          <div className="map-header">
            <div className="map-stats">
              <div className="map-stat">
                <span className="stat-label">Objektų žemėlapyje:</span>
                <span className="stat-value">{properties.length}</span>
              </div>
              {filters.city !== 'all' && (
                <div className="map-stat">
                  <span className="stat-label">Miestas:</span>
                  <span className="stat-value">{filters.city}</span>
                </div>
              )}
              {filters.propertyType !== 'all' && (
                <div className="map-stat">
                  <span className="stat-label">NT tipas:</span>
                  <span className="stat-value">
                    {filters.propertyType === 'flat' ? 'Butas' : 
                    filters.propertyType === 'house' ? 'Namas' :
                    filters.propertyType === 'land' ? 'Sklypas' :
                    filters.propertyType === 'commercial' ? 'Komercinis' :
                    filters.propertyType === 'cottage' ? 'Sodyba' : 'Kita'}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="map-visualization" style={{ height: '700px' }}>
            <PropertyMap 
              viewMode={viewMode}
              onPropertySelect={handlePropertySelect}
              selectedProperty={selectedProperty}
            />
          </div>
          
          <div className="map-instructions">
            <p>
              <strong>Naudojimosi instrukcijos:</strong> Spauskite ant taško, kad gautumėte detalesnę 
              informaciją apie pasirinktą NT objektą. Naudokite filtrus, kad patikslintumėte paiešką.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MapPage;