import React, { useState } from 'react';
import { useFilters } from '../../context/FilterContext';
import { usePropertyData } from '../../context/DataContext';
import PriceFilter from './PriceFilter';
import AreaFilter from './AreaFilter';
import CityFilter from './CityFilter';

const FilterPanel = () => {
  const { filters, updateFilter, updateFilters, resetFilters } = useFilters();
  const { stats } = usePropertyData();
  const [expanded, setExpanded] = useState(false);
  
  const cityOptions = [
    { value: 'all', label: 'Visi miestai' },
    { value: 'Vilnius', label: 'Vilnius' },
    { value: 'Kaunas', label: 'Kaunas' },
    { value: 'Klaipėda', label: 'Klaipėda' },
    { value: 'Šiauliai', label: 'Šiauliai' },
    { value: 'Panevėžys', label: 'Panevėžys' },
    // Galima pridėti daugiau miestų
  ];

  const propertyTypeOptions = [
    { value: 'all', label: 'Visi tipai' },
    { value: 'flat', label: 'Butas' },
    { value: 'house', label: 'Namas' },
    { value: 'cottage', label: 'Sodyba' },
    { value: 'land', label: 'Sklypas' },
    { value: 'commercial', label: 'Komercinis' },
  ];

  const roomOptions = [
    { value: 'all', label: 'Visi' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5+', label: '5+' },
  ];

  const handleCityChange = (e) => {
    updateFilter('city', e.target.value);
  };

  const handlePropertyTypeChange = (e) => {
    updateFilter('propertyType', e.target.value);
  };

  const handleRoomsChange = (e) => {
    updateFilter('rooms', e.target.value);
  };

  const applyFilters = () => {
    // Čia galite įdėti papildomą logiką, jei reikia
    console.log('Filtrai pritaikyti:', filters);
  };

  const handleReset = () => {
    resetFilters();
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filtrai</h3>
        <button 
          className="toggle-button"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Suskleisti' : 'Išskleisti'}
        </button>
      </div>

      <div className={`filter-content ${expanded ? 'expanded' : ''}`}>
        <div className="filter-group">
          <label htmlFor="city-filter">Miestas:</label>
          <select 
            id="city-filter"
            value={filters.city}
            onChange={handleCityChange}
            className="filter-select"
          >
            {cityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="property-type-filter">NT tipas:</label>
          <select 
            id="property-type-filter"
            value={filters.propertyType}
            onChange={handlePropertyTypeChange}
            className="filter-select"
          >
            {propertyTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="rooms-filter">Kambarių skaičius:</label>
          <select 
            id="rooms-filter"
            value={filters.rooms}
            onChange={handleRoomsChange}
            className="filter-select"
          >
            {roomOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <PriceFilter 
          min={stats.priceRange?.min || 0} 
          max={stats.priceRange?.max || 1000000}
          value={[filters.priceMin, filters.priceMax]}
          onChange={(values) => {
            updateFilters({
              priceMin: values[0],
              priceMax: values[1]
            });
          }}
        />

        <AreaFilter
          min={0}
          max={500}
          value={[filters.areaMin, filters.areaMax]}
          onChange={(values) => {
            updateFilters({
              areaMin: values[0],
              areaMax: values[1]
            });
          }}
        />

        {/* Čia galite pridėti daugiau filtrų */}

        <div className="filter-actions">
          <button className="apply-button" onClick={applyFilters}>
            Pritaikyti
          </button>
          <button className="reset-button" onClick={handleReset}>
            Atstatyti
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;