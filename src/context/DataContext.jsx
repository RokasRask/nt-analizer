import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchProperties } from '../api/propertyService';
import mockData from '../data/mockData';

// Sukuriamas duomenų kontekstas
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    avgPrice: 0,
    avgPricePerSqm: 0,
    totalListings: 0,
    priceRange: { min: 0, max: 0 },
    cityDistribution: {}
  });

  // Duomenų užkrovimas
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Bandymas gauti duomenis iš API
        const data = await fetchProperties();
        setProperties(data);
        calculateStats(data);
      } catch (err) {
        console.error('Klaida gaunant duomenis:', err);
        setError('Nepavyko užkrauti duomenų. Naudojami testiniai duomenys.');
        // Jei nepavyksta gauti duomenų iš API, naudojami testiniai duomenys
        setProperties(mockData);
        calculateStats(mockData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Statistikos skaičiavimas
  const calculateStats = (data) => {
    if (!data || data.length === 0) return;

    // Vidutinė kaina
    const avgPrice = data.reduce((sum, item) => sum + item.price, 0) / data.length;
    
    // Vidutinė kaina už kvadratinį metrą
    const avgPricePerSqm = data.reduce((sum, item) => sum + (item.price / item.area), 0) / data.length;
    
    // Kainų rėžiai
    const priceRange = {
      min: Math.min(...data.map(item => item.price)),
      max: Math.max(...data.map(item => item.price))
    };
    
    // Skelbimų pasiskirstymas pagal miestus
    const cityDistribution = data.reduce((acc, item) => {
      acc[item.city] = (acc[item.city] || 0) + 1;
      return acc;
    }, {});

    setStats({
      avgPrice,
      avgPricePerSqm,
      totalListings: data.length,
      priceRange,
      cityDistribution
    });
  };

  // Filtruotų duomenų gavimas pagal filtrus
  const getFilteredData = (filters) => {
    return properties.filter(property => {
      // Miesto filtras
      if (filters.city !== 'all' && property.city !== filters.city) return false;
      
      // Kainos filtras
      if (property.price < filters.priceMin || property.price > filters.priceMax) return false;
      
      // Ploto filtras
      if (property.area < filters.areaMin || property.area > filters.areaMax) return false;
      
      // Kambarių filtras
      if (filters.rooms !== 'all' && property.rooms !== parseInt(filters.rooms)) return false;
      
      // NT tipo filtras
      if (filters.propertyType !== 'all' && property.type !== filters.propertyType) return false;
      
      // Statybos metų filtras
      if (property.buildYear < filters.yearMin || property.buildYear > filters.yearMax) return false;
      
      return true;
    });
  };

  return (
    <DataContext.Provider 
      value={{ 
        properties,
        loading,
        error,
        stats,
        getFilteredData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Hook'as duomenų konteksto naudojimui
export const usePropertyData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('usePropertyData turi būti naudojamas DataProvider viduje');
  }
  return context;
};

export default DataContext;