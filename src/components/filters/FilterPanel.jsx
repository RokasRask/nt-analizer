import React, { useState } from 'react';
import { useFilters } from '../../context/FilterContext';
import CityFilter from './CityFilter';
import PriceFilter from './PriceFilter';
import AreaFilter from './AreaFilter';
import './FilterPanel.scss';

const FilterPanel = () => {
  const { filters, updateFilter, updateFilters, resetFilters } = useFilters();
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Property type options
  const propertyTypeOptions = [
    { value: 'all', label: 'Visi tipai' },
    { value: 'flat', label: 'Butas' },
    { value: 'house', label: 'Namas' },
    { value: 'land', label: 'Sklypas' },
    { value: 'commercial', label: 'Komercinis' },
    { value: 'cottage', label: 'Sodyba' },
  ];

  // Room options
  const roomOptions = [
    { value: 'all', label: 'Visi' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5+', label: '5+' },
  ];

  // Sort options
  const sortOptions = [
    { value: 'priceAsc', label: 'Kaina: nuo mažiausios' },
    { value: 'priceDesc', label: 'Kaina: nuo didžiausios' },
    { value: 'dateDesc', label: 'Data: naujausi' },
    { value: 'dateAsc', label: 'Data: seniausi' },
    { value: 'areaAsc', label: 'Plotas: nuo mažiausio' },
    { value: 'areaDesc', label: 'Plotas: nuo didžiausio' },
  ];

  // Toggle panel expansion
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle filter changes
  const handlePropertyTypeChange = (e) => {
    updateFilter('propertyType', e.target.value);
  };

  const handleRoomsChange = (e) => {
    updateFilter('rooms', e.target.value);
  };

  const handleSortChange = (e) => {
    updateFilter('sort', e.target.value);
  };

  // Reset all filters
  const handleReset = () => {
    resetFilters();
  };

  return (
    <div className="filter-panel">
      <div className="filter-panel-title">
        <span>Filtrai</span>
        <div className="filter-actions">
          <button className="reset-button" onClick={handleReset}>
            <i className="fas fa-undo"></i> Atstatyti
          </button>
          <div className="toggle-icon" onClick={toggleExpand}>
            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
          </div>
        </div>
      </div>
      
      <div className={`filter-panel-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="filter-group">
          <CityFilter 
            value={filters.city} 
            onChange={(value) => updateFilter('city', value)} 
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="property-type-filter">NT tipas</label>
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
          <label htmlFor="rooms-filter">Kambarių skaičius</label>
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
        
        <div className="filter-group">
          <label>Kaina</label>
          <PriceFilter 
            min={0} 
            max={1000000}
            value={[filters.priceMin, filters.priceMax]}
            onChange={(values) => {
              updateFilters({
                priceMin: values[0],
                priceMax: values[1]
              });
            }}
          />
        </div>
        
        <div className="filter-group">
          <label>Plotas</label>
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
        </div>
        
        <div className="filter-group">
          <label htmlFor="sort-filter">Rūšiavimas</label>
          <select 
            id="sort-filter"
            value={filters.sort}
            onChange={handleSortChange}
            className="filter-select"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group additional-options">
          <label>Papildomi filtrai</label>
          <div className="checkbox-list">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Naujos statybos</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Su balkonu</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Su nuotraukomis</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Renovuotas namas</span>
            </label>
          </div>
        </div>
        
        <button 
          className="apply-filters-button"
          onClick={() => console.log('Filters applied:', filters)}
        >
          <i className="fas fa-filter"></i> Pritaikyti filtrus
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;