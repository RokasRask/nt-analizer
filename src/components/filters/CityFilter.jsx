import React from 'react';
import { usePropertyData } from '../../context/DataContext';

const CityFilter = ({ value, onChange }) => {
  const { stats } = usePropertyData();
  
  // Gauti miestų sąrašą iš statistikos
  const getCityOptions = () => {
    const cities = stats.cityDistribution ? Object.keys(stats.cityDistribution) : [];
    
    // Pridedame "Visi" miestai
    const options = [
      { value: 'all', label: 'Visi miestai' }
    ];
    
    // Pridedame miestus, surikiuotus pagal skelbimų skaičių
    cities.sort((a, b) => {
      const countA = stats.cityDistribution[a] || 0;
      const countB = stats.cityDistribution[b] || 0;
      return countB - countA;
    }).forEach(city => {
      const count = stats.cityDistribution[city] || 0;
      options.push({
        value: city,
        label: `${city} (${count})`
      });
    });
    
    return options;
  };
  
  const cityOptions = getCityOptions();
  
  const handleCityChange = (e) => {
    onChange(e.target.value);
  };
  
  return (
    <div className="city-filter filter-group">
      <label htmlFor="city-filter">Miestas:</label>
      <select
        id="city-filter"
        value={value}
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
  );
};

export default CityFilter;