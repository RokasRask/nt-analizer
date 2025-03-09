import React, { useState } from 'react';
import { useFilters } from '../../context/FilterContext';
import PriceFilter from './PriceFilter';
import AreaFilter from './AreaFilter';
import './SidebarFilter.scss';

const SidebarFilter = () => {
  const { filters, updateFilter, updateFilters, resetFilters } = useFilters();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Miestų sąrašas
  const cityOptions = [
    { value: 'all', label: 'Visi miestai' },
    { value: 'Vilnius', label: 'Vilnius' },
    { value: 'Kaunas', label: 'Kaunas' },
    { value: 'Klaipėda', label: 'Klaipėda' },
    { value: 'Šiauliai', label: 'Šiauliai' },
    { value: 'Panevėžys', label: 'Panevėžys' },
    { value: 'Alytus', label: 'Alytus' },
    { value: 'Marijampolė', label: 'Marijampolė' },
    { value: 'Mažeikiai', label: 'Mažeikiai' },
    { value: 'Jonava', label: 'Jonava' },
    { value: 'Utena', label: 'Utena' },
  ];

  // NT tipų sąrašas
  const propertyTypeOptions = [
    { value: 'all', label: 'Visi tipai' },
    { value: 'flat', label: 'Butas' },
    { value: 'house', label: 'Namas' },
    { value: 'land', label: 'Sklypas' },
    { value: 'commercial', label: 'Komercinis' },
    { value: 'cottage', label: 'Sodyba' },
  ];

  // Kambarių skaičiaus sąrašas
  const roomOptions = [
    { value: 'all', label: 'Visi' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5+', label: '5+' },
  ];

  // Rūšiavimo sąrašas
  const sortOptions = [
    { value: 'priceAsc', label: 'Kaina: nuo mažiausios' },
    { value: 'priceDesc', label: 'Kaina: nuo didžiausios' },
    { value: 'dateDesc', label: 'Data: naujausi' },
    { value: 'dateAsc', label: 'Data: seniausi' },
    { value: 'areaAsc', label: 'Plotas: nuo mažiausio' },
    { value: 'areaDesc', label: 'Plotas: nuo didžiausio' },
  ];

  // Filtro reikšmių keitimo funkcijos
  const handleCityChange = (e) => {
    updateFilter('city', e.target.value);
  };

  const handlePropertyTypeChange = (e) => {
    updateFilter('propertyType', e.target.value);
  };

  const handleRoomsChange = (e) => {
    updateFilter('rooms', e.target.value);
  };

  const handleSortChange = (e) => {
    updateFilter('sort', e.target.value);
  };

  // Filtro išplėtimo perjungimas
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Filtro pritaikymas
  const applyFilters = () => {
    // Čia galite pridėti papildomą logiką, jei reikia
    console.log('Filtrai pritaikyti:', filters);
    setIsExpanded(false);
  };

  // Filtro atstatymas
  const handleReset = () => {
    resetFilters();
  };

  return (
    <div className={`sidebar-filter ${isExpanded ? 'expanded' : ''}`}>
      <button className="toggle-filter-button" onClick={toggleExpand}>
        {isExpanded ? (
          <>
            <i className="fas fa-times"></i>
            <span>Uždaryti filtrus</span>
          </>
        ) : (
          <>
            <i className="fas fa-filter"></i>
            <span>Filtruoti</span>
          </>
        )}
      </button>
      
      <div className="filter-content">
        <div className="filter-header">
          <h3>Filtrai</h3>
          <button className="reset-button" onClick={handleReset}>
            <i className="fas fa-undo"></i> Atstatyti
          </button>
        </div>
        
        <div className="filter-body">
          <div className="filter-group">
            <label htmlFor="city-filter">Miestas</label>
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
          
          {/* Papildomi filtrai gali būti čia */}
          
          <div className="filter-actions">
            <button className="apply-button" onClick={applyFilters}>
              <i className="fas fa-check"></i> Pritaikyti filtrus
            </button>
          </div>
        </div>
      </div>
      
      {/* Filtro overlay fonas, kad būtų galima uždaryti filtrą paspaudus už jo ribų */}
      {isExpanded && (
        <div className="filter-overlay" onClick={toggleExpand}></div>
      )}
    </div>
  );
};

export default SidebarFilter;