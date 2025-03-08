import React from 'react';
import { usePropertyData } from '../../context/DataContext';
import { useFilters } from '../../context/FilterContext';
import FilterPanel from '../filters/FilterPanel';
import PropertyMap from '../visualizations/PropertyMap';
import PriceChart from '../visualizations/PriceChart';
import TrendChart from '../visualizations/TrendChart';
import ComparisonChart from '../visualizations/ComparisonChart';

const MainContent = () => {
  const { properties, loading, error, stats } = usePropertyData();
  const { filters } = useFilters();

  if (loading) {
    return (
      <div className="main-content-loading">
        <div className="loading-spinner"></div>
        <p>Kraunami duomenys...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content-error">
        <h2>Įvyko klaida</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Bandyti dar kartą</button>
      </div>
    );
  }

  return (
    <div className="main-content-container">
      <div className="sidebar">
        <FilterPanel />
        
        <div className="stats-summary">
          <h3>Statistika</h3>
          <div className="stats-item">
            <span className="stats-label">Vidutinė kaina:</span>
            <span className="stats-value">{stats.avgPrice.toLocaleString()} €</span>
          </div>
          <div className="stats-item">
            <span className="stats-label">Vidutinė kaina už m²:</span>
            <span className="stats-value">{stats.avgPricePerSqm.toLocaleString()} €/m²</span>
          </div>
          <div className="stats-item">
            <span className="stats-label">Iš viso skelbimų:</span>
            <span className="stats-value">{stats.totalListings}</span>
          </div>
          <div className="stats-item">
            <span className="stats-label">Kainų rėžiai:</span>
            <span className="stats-value">
              {stats.priceRange.min.toLocaleString()} € - {stats.priceRange.max.toLocaleString()} €
            </span>
          </div>
        </div>
      </div>
      
      <div className="content-area">
        <h2>NT rinkos Lietuvoje analizė</h2>
        
        {filters.city !== 'all' && (
          <div className="city-header">
            <h3>Duomenys miestui: {filters.city}</h3>
          </div>
        )}
        
        <div className="visualization-grid">
          <div className="visualization-card full-width">
            <h3>NT objektų žemėlapis</h3>
            <PropertyMap />
          </div>
          
          <div className="visualization-card">
            <h3>Kainų analizė</h3>
            <PriceChart />
          </div>
          
          <div className="visualization-card">
            <h3>Kainų tendencijos</h3>
            <TrendChart />
          </div>
          
          <div className="visualization-card full-width">
            <h3>Miestų palyginimas</h3>
            <ComparisonChart />
          </div>
        </div>
        
        <div className="property-listing">
          <h3>NT objektų sąrašas ({properties.length})</h3>
          <div className="property-grid">
            {properties.slice(0, 6).map((property) => (
              <div key={property.id} className="property-card">
                <div className="property-image">
                  {/* Vėliau galima įdėti tikrus paveikslėlius */}
                  <div className="placeholder-image"></div>
                </div>
                <div className="property-info">
                  <h4>{property.title}</h4>
                  <p className="property-price">{property.price.toLocaleString()} €</p>
                  <p className="property-details">
                    {property.area} m² | {property.rooms} kamb. | {property.city}, {property.district}
                  </p>
                  <div className="property-meta">
                    <span>{property.propertyType === 'flat' ? 'Butas' : 
                          property.propertyType === 'house' ? 'Namas' :
                          property.propertyType === 'land' ? 'Sklypas' :
                          property.propertyType === 'commercial' ? 'Komercinis' :
                          property.propertyType === 'cottage' ? 'Sodyba' : 'Kita'}</span>
                    {property.buildYear && <span>{property.buildYear} m.</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {properties.length > 6 && (
            <div className="view-more">
              <button>Rodyti daugiau ({properties.length - 6})</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;