import mockData from '../data/mockData';

// Apibrėžiame API URL - vėliau pakeisti į tikrą backend arba serverless funkcijos URL
const API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

/**
 * Gauna NT objektų sąrašą
 * @param {Object} params - Užklausos parametrai (filtrai ir kt.)
 * @returns {Promise<Array>} - Pažadas su NT objektų sąrašu
 */
export const fetchProperties = async (params = {}) => {
  try {
    // Tikroje aplikacijoje čia būtų API užklausa
    // const response = await fetch(`${API_URL}/properties`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: params ? JSON.stringify(params) : undefined,
    // });
    
    // if (!response.ok) {
    //   throw new Error(`API error: ${response.status}`);
    // }
    
    // const data = await response.json();
    // return data;

    // Kol nėra tikro API, grąžiname testinius duomenis su nedidele delsa, 
    // kad imituotume tinklo užklausą
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filtruojame testinį duomenų rinkinį pagal parametrus
        let filteredData = [...mockData];
        
        if (params.city && params.city !== 'all') {
          filteredData = filteredData.filter(item => item.city === params.city);
        }
        
        if (params.priceMin !== undefined) {
          filteredData = filteredData.filter(item => item.price >= params.priceMin);
        }
        
        if (params.priceMax !== undefined) {
          filteredData = filteredData.filter(item => item.price <= params.priceMax);
        }
        
        if (params.propertyType && params.propertyType !== 'all') {
          filteredData = filteredData.filter(item => item.propertyType === params.propertyType);
        }

        resolve(filteredData);
      }, 500); // 500ms delsa imitacijai
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

/**
 * Gauna konkretų NT objektą pagal ID
 * @param {string|number} id - NT objekto ID
 * @returns {Promise<Object>} - Pažadas su NT objekto duomenimis
 */
export const fetchPropertyById = async (id) => {
  try {
    // Tikroje aplikacijoje čia būtų API užklausa
    // const response = await fetch(`${API_URL}/properties/${id}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    
    // if (!response.ok) {
    //   throw new Error(`API error: ${response.status}`);
    // }
    
    // const data = await response.json();
    // return data;

    // Kol nėra tikro API, grąžiname testinius duomenis su nedidele delsa
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const property = mockData.find(item => item.id === parseInt(id));
        
        if (property) {
          resolve(property);
        } else {
          reject(new Error(`Property with ID ${id} not found`));
        }
      }, 300);
    });
  } catch (error) {
    console.error(`Error fetching property ID ${id}:`, error);
    throw error;
  }
};

/**
 * Gauna NT objektų statistiką
 * @returns {Promise<Object>} - Pažadas su statistikos duomenimis
 */
export const fetchPropertyStats = async () => {
  try {
    // Tikroje aplikacijoje čia būtų API užklausa
    // const response = await fetch(`${API_URL}/properties/stats`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    
    // if (!response.ok) {
    //   throw new Error(`API error: ${response.status}`);
    // }
    
    // const data = await response.json();
    // return data;

    // Kol nėra tikro API, apskaičiuojame statistiką iš testinių duomenų
    return new Promise((resolve) => {
      setTimeout(() => {
        const totalCount = mockData.length;
        const avgPrice = mockData.reduce((sum, item) => sum + item.price, 0) / totalCount;
        const avgArea = mockData.reduce((sum, item) => sum + item.area, 0) / totalCount;
        const minPrice = Math.min(...mockData.map(item => item.price));
        const maxPrice = Math.max(...mockData.map(item => item.price));
        
        // Skaičiuojame NT objektų pasiskirstymą pagal miestus
        const cityDistribution = mockData.reduce((acc, item) => {
          acc[item.city] = (acc[item.city] || 0) + 1;
          return acc;
        }, {});
        
        // Skaičiuojame NT objektų pasiskirstymą pagal tipus
        const typeDistribution = mockData.reduce((acc, item) => {
          acc[item.propertyType] = (acc[item.propertyType] || 0) + 1;
          return acc;
        }, {});
        
        resolve({
          totalCount,
          avgPrice,
          avgArea,
          priceRange: { min: minPrice, max: maxPrice },
          cityDistribution,
          typeDistribution
        });
      }, 300);
    });
  } catch (error) {
    console.error('Error fetching property stats:', error);
    throw error;
  }
};

/**
 * Gauna vidurkines kainas pagal rajonus
 * @param {string} city - Miestas
 * @returns {Promise<Array>} - Pažadas su rajonų kainų duomenimis
 */
export const fetchDistrictPrices = async (city) => {
  try {
    // Tikroje aplikacijoje čia būtų API užklausa
    // const response = await fetch(`${API_URL}/properties/district-prices?city=${city}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    
    // if (!response.ok) {
    //   throw new Error(`API error: ${response.status}`);
    // }
    
    // const data = await response.json();
    // return data;

    // Kol nėra tikro API, skaičiuojame iš testinių duomenų
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filtruojame nurodytą miestą
        const cityProperties = city === 'all' 
          ? mockData 
          : mockData.filter(item => item.city === city);
        
        // Grupuojame pagal rajonus ir skaičiuojame vidurkius
        const districtGroups = cityProperties.reduce((acc, item) => {
          if (!acc[item.district]) {
            acc[item.district] = {
              district: item.district,
              city: item.city,
              properties: [],
              totalPrice: 0,
              totalArea: 0,
              count: 0
            };
          }
          
          acc[item.district].properties.push(item);
          acc[item.district].totalPrice += item.price;
          acc[item.district].totalArea += item.area;
          acc[item.district].count += 1;
          
          return acc;
        }, {});
        
        // Formatuojame rezultatus
        const districtPrices = Object.values(districtGroups).map(group => ({
          district: group.district,
          city: group.city,
          avgPrice: Math.round(group.totalPrice / group.count),
          avgPricePerSqm: Math.round(group.totalPrice / group.totalArea),
          count: group.count
        }));
        
        resolve(districtPrices);
      }, 300);
    });
  } catch (error) {
    console.error('Error fetching district prices:', error);
    throw error;
  }
};

/**
 * Gauna kainų kitimo duomenis
 * @param {Object} params - Užklausos parametrai
 * @returns {Promise<Array>} - Pažadas su kainų kitimo duomenimis
 */
export const fetchPriceTrends = async (params = {}) => {
  try {
    // Tikroje aplikacijoje čia būtų API užklausa
    // const queryParams = new URLSearchParams(params).toString();
    // const response = await fetch(`${API_URL}/properties/price-trends?${queryParams}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    
    // if (!response.ok) {
    //   throw new Error(`API error: ${response.status}`);
    // }
    
    // const data = await response.json();
    // return data;

    // Kol nėra tikro API, generuojame duomenis
    return new Promise((resolve) => {
      setTimeout(() => {
        // Imitaciniai kainų kitimo duomenys pagal mėnesius
        const trendData = [
          { month: '2022-01', avgPrice: 1450, avgPricePerSqm: 1850 },
          { month: '2022-02', avgPrice: 1480, avgPricePerSqm: 1880 },
          { month: '2022-03', avgPrice: 1495, avgPricePerSqm: 1900 },
          { month: '2022-04', avgPrice: 1510, avgPricePerSqm: 1920 },
          { month: '2022-05', avgPrice: 1525, avgPricePerSqm: 1950 },
          { month: '2022-06', avgPrice: 1540, avgPricePerSqm: 1980 },
          { month: '2022-07', avgPrice: 1555, avgPricePerSqm: 2000 },
          { month: '2022-08', avgPrice: 1570, avgPricePerSqm: 2030 },
          { month: '2022-09', avgPrice: 1590, avgPricePerSqm: 2050 },
          { month: '2022-10', avgPrice: 1610, avgPricePerSqm: 2080 },
          { month: '2022-11', avgPrice: 1630, avgPricePerSqm: 2110 },
          { month: '2022-12', avgPrice: 1650, avgPricePerSqm: 2150 },
          { month: '2023-01', avgPrice: 1670, avgPricePerSqm: 2180 },
          { month: '2023-02', avgPrice: 1690, avgPricePerSqm: 2210 },
          { month: '2023-03', avgPrice: 1710, avgPricePerSqm: 2240 },
        ];
        
        resolve(trendData);
      }, 400);
    });
  } catch (error) {
    console.error('Error fetching price trends:', error);
    throw error;
  }
};

// Eksportuojame visas funkcijas
export default {
  fetchProperties,
  fetchPropertyById,
  fetchPropertyStats,
  fetchDistrictPrices,
  fetchPriceTrends
};