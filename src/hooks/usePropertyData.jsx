import { useState, useEffect, useCallback } from 'react';
import { useFilters } from '../context/FilterContext';
import axios from 'axios';

/**
 * Hook'as NT duomenų gavimui ir apdorojimui
 */
const usePropertyData = () => {
  const { filters } = useFilters();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    avgPrice: 0,
    avgPricePerSqm: 0,
    totalListings: 0,
    priceRange: { min: 0, max: 0 },
    cityDistribution: {}
  });

  // API endpoint
  const API_URL = process.env.REACT_APP_API_URL || '/api';

  // Duomenų gavimas
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    
    try {
      const response = await axios.get(`${API_URL}/properties`, {
        params: {
          ...filters,
          limit: 500 // Maksimalus grąžinamų objektų skaičius
        }
      });
      
      setProperties(response.data.properties);
      setFilteredProperties(response.data.properties);
      
      // Statistikos gavimas
      await fetchStats();
      
      setLoading(false);
    } catch (err) {
      console.error('Klaida gaunant NT duomenis:', err);
      setError('Nepavyko užkrauti duomenų. Bandykite vėliau.');
      
      // Bandyti naudoti testinius duomenis
      try {
        const mockResponse = await import('../data/mockData');
        setProperties(mockResponse.default);
        setFilteredProperties(mockResponse.default);
        calculateStats(mockResponse.default);
        setLoading(false);
      } catch (mockErr) {
        console.error('Nepavyko užkrauti testinių duomenų:', mockErr);
      }
    }
  }, [API_URL, filters]);

  // Statistikos gavimas
  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/properties/stats/general`, {
        params: {
          city: filters.city,
          propertyType: filters.propertyType
        }
      });
      
      setStats(response.data);
    } catch (err) {
      console.error('Klaida gaunant statistiką:', err);
      // Jei nepavyksta gauti statistikos, bandome apskaičiuoti iš turimų duomenų
      calculateStats(properties);
    }
  }, [API_URL, filters.city, filters.propertyType, properties]);

  // Statistikos skaičiavimas iš turimų duomenų
  const calculateStats = useCallback((data) => {
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
  }, []);

  // Filtravimas pagal vartotojo pasirinktus filtrus
  const filterProperties = useCallback(() => {
    // Jei nėra duomenų, grąžiname tuščią masyvą
    if (!properties || properties.length === 0) {
      setFilteredProperties([]);
      return;
    }
    
    const filtered = properties.filter(property => {
      // Miesto filtras
      if (filters.city !== 'all' && property.city !== filters.city) return false;
      
      // Kainos filtras
      if (property.price < filters.priceMin || property.price > filters.priceMax) return false;
      
      // Ploto filtras
      if (property.area < filters.areaMin || property.area > filters.areaMax) return false;
      
      // Kambarių filtras
      if (filters.rooms !== 'all' && property.rooms !== parseInt(filters.rooms)) return false;
      
      // NT tipo filtras
      if (filters.propertyType !== 'all' && property.propertyType !== filters.propertyType) return false;
      
      return true;
    });
    
    setFilteredProperties(filtered);
    calculateStats(filtered);
  }, [properties, filters, calculateStats]);

  // Duomenų gavimas iš API kai užkraunamas komponentas
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Filtravimas kai keičiasi filtrai arba duomenys
  useEffect(() => {
    filterProperties();
  }, [properties, filters, filterProperties]);

  return {
    properties: filteredProperties,
    loading,
    error,
    stats,
    refreshData: fetchProperties
  };
};

export default usePropertyData;