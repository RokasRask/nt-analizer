import React, { createContext, useState, useContext } from 'react';

// Sukuriamas filtravimo kontekstas
const FilterContext = createContext();

// Pradinės filtravimo būsenos reikšmės
const initialFilters = {
  city: 'all',      // Miestas/rajonas
  priceMin: 0,      // Min kaina
  priceMax: 1000000, // Max kaina
  areaMin: 0,       // Min plotas
  areaMax: 500,     // Max plotas
  rooms: 'all',     // Kambarių skaičius
  propertyType: 'all', // NT tipas (butas, namas, etc.)
  yearMin: 1900,    // Statybos metai nuo
  yearMax: new Date().getFullYear(), // Statybos metai iki
  dateFrom: null,   // Skelbimo data nuo
  dateTo: null      // Skelbimo data iki
};

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState(initialFilters);
  
  // Atskiro filtro atnaujinimas
  const updateFilter = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  };
  
  // Kelių filtrų atnaujinimas vienu metu
  const updateFilters = (newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };
  
  // Filtrų atstatymas į pradinę būseną
  const resetFilters = () => {
    setFilters(initialFilters);
  };
  
  return (
    <FilterContext.Provider 
      value={{ 
        filters, 
        updateFilter, 
        updateFilters, 
        resetFilters 
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

// Hook'as filtravimo konteksto naudojimui
export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters turi būti naudojamas FilterProvider viduje');
  }
  return context;
};

export default FilterContext;