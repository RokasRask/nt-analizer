/**
 * API client for NT Analizė
 * Handles all API calls to the backend
 */
import axios from 'axios';
import mockData from '../data/mockData';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'https://api.nt-analize.lt';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || 'Įvyko nenumatyta klaida',
      status: error.response?.status,
      data: error.response?.data,
    };
    
    // Handle unauthorized errors
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    return Promise.reject(customError);
  }
);

/**
 * Mock API delay for development
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise} - Promise that resolves after the delay
 */
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * API functions
 */
const api = {
  /**
   * Get property listings with filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} - Property listings and metadata
   */
  getProperties: async (filters = {}) => {
    try {
      const response = await apiClient.get('/properties', { params: filters });
      return response.data;
    } catch (error) {
      console.error('API Error - getProperties:', error);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        await mockDelay();
        console.log('Using mock data for properties');
        
        // Filter mock data
        let filteredData = [...mockData];
        
        if (filters.city && filters.city !== 'all') {
          filteredData = filteredData.filter(property => property.city === filters.city);
        }
        
        if (filters.propertyType && filters.propertyType !== 'all') {
          filteredData = filteredData.filter(property => property.propertyType === filters.propertyType);
        }
        
        if (filters.priceMin !== undefined) {
          filteredData = filteredData.filter(property => property.price >= filters.priceMin);
        }
        
        if (filters.priceMax !== undefined) {
          filteredData = filteredData.filter(property => property.price <= filters.priceMax);
        }
        
        if (filters.areaMin !== undefined) {
          filteredData = filteredData.filter(property => property.area >= filters.areaMin);
        }
        
        if (filters.areaMax !== undefined) {
          filteredData = filteredData.filter(property => property.area <= filters.areaMax);
        }
        
        if (filters.rooms && filters.rooms !== 'all') {
          filteredData = filteredData.filter(property => 
            property.rooms === parseInt(filters.rooms) || 
            (filters.rooms === '5+' && property.rooms >= 5)
          );
        }
        
        return {
          properties: filteredData,
          total: filteredData.length,
          page: 1,
          pageSize: filteredData.length,
          totalPages: 1
        };
      }
      
      throw error;
    }
  },
  
  /**
   * Get property by ID
   * @param {string|number} id - Property ID
   * @returns {Promise<Object>} - Property details
   */
  getPropertyById: async (id) => {
    try {
      const response = await apiClient.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error - getPropertyById:', error);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        await mockDelay();
        console.log('Using mock data for property details');
        
        const property = mockData.find(p => p.id === parseInt(id));
        
        if (!property) {
          throw new Error(`Property with ID ${id} not found`);
        }
        
        return property;
      }
      
      throw error;
    }
  },
  
  /**
   * Get property statistics
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Property statistics
   */
  getPropertyStats: async (params = {}) => {
    try {
      const response = await apiClient.get('/stats', { params });
      return response.data;
    } catch (error) {
      console.error('API Error - getPropertyStats:', error);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        await mockDelay();
        console.log('Using mock data for property stats');
        
        // Calculate basic statistics from mock data
        let filteredData = [...mockData];
        
        if (params.city && params.city !== 'all') {
          filteredData = filteredData.filter(property => property.city === params.city);
        }
        
        if (params.propertyType && params.propertyType !== 'all') {
          filteredData = filteredData.filter(property => property.propertyType === params.propertyType);
        }
        
        const avgPrice = filteredData.reduce((sum, property) => sum + property.price, 0) / filteredData.length;
        const avgArea = filteredData.reduce((sum, property) => sum + property.area, 0) / filteredData.length;
        const avgPricePerSqm = filteredData.reduce((sum, property) => sum + (property.price / property.area), 0) / filteredData.length;
        
        // Price ranges
        const prices = filteredData.map(property => property.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        // City distribution
        const cityDistribution = filteredData.reduce((acc, property) => {
          acc[property.city] = (acc[property.city] || 0) + 1;
          return acc;
        }, {});
        
        // Type distribution
        const typeDistribution = filteredData.reduce((acc, property) => {
          acc[property.propertyType] = (acc[property.propertyType] || 0) + 1;
          return acc;
        }, {});
        
        return {
          totalListings: filteredData.length,
          avgPrice,
          avgArea,
          avgPricePerSqm,
          priceRange: { min: minPrice, max: maxPrice },
          cityDistribution,
          typeDistribution
        };
      }
      
      throw error;
    }
  },
  
  /**
   * Get price trends data
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} - Price trends data
   */
  getPriceTrends: async (params = {}) => {
    try {
      const response = await apiClient.get('/trends', { params });
      return response.data;
    } catch (error) {
      console.error('API Error - getPriceTrends:', error);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        await mockDelay();
        console.log('Using mock data for price trends');
        
        // Generate mock trend data
        const trendData = [
          { month: '2022-01', avgPrice: 1450, avgPricePerSqm: 1850, count: 245 },
          { month: '2022-02', avgPrice: 1480, avgPricePerSqm: 1880, count: 263 },
          { month: '2022-03', avgPrice: 1495, avgPricePerSqm: 1900, count: 289 },
          { month: '2022-04', avgPrice: 1510, avgPricePerSqm: 1920, count: 301 },
          { month: '2022-05', avgPrice: 1525, avgPricePerSqm: 1950, count: 328 },
          { month: '2022-06', avgPrice: 1540, avgPricePerSqm: 1980, count: 344 },
          { month: '2022-07', avgPrice: 1555, avgPricePerSqm: 2000, count: 329 },
          { month: '2022-08', avgPrice: 1570, avgPricePerSqm: 2030, count: 312 },
          { month: '2022-09', avgPrice: 1590, avgPricePerSqm: 2050, count: 298 },
          { month: '2022-10', avgPrice: 1610, avgPricePerSqm: 2080, count: 315 },
          { month: '2022-11', avgPrice: 1630, avgPricePerSqm: 2110, count: 332 },
          { month: '2022-12', avgPrice: 1650, avgPricePerSqm: 2150, count: 287 },
          { month: '2023-01', avgPrice: 1670, avgPricePerSqm: 2180, count: 267 },
          { month: '2023-02', avgPrice: 1690, avgPricePerSqm: 2210, count: 298 },
          { month: '2023-03', avgPrice: 1710, avgPricePerSqm: 2240, count: 324 },
          { month: '2023-04', avgPrice: 1730, avgPricePerSqm: 2270, count: 352 },
          { month: '2023-05', avgPrice: 1750, avgPricePerSqm: 2300, count: 378 },
          { month: '2023-06', avgPrice: 1780, avgPricePerSqm: 2340, count: 401 },
        ];
        
        return trendData;
      }
      
      throw error;
    }
  },
  
  /**
   * Get district price data
   * @param {string} city - City name
   * @returns {Promise<Array>} - District price data
   */
  getDistrictPrices: async (city) => {
    try {
      const response = await apiClient.get(`/districts/${city}/prices`);
      return response.data;
    } catch (error) {
      console.error('API Error - getDistrictPrices:', error);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        await mockDelay();
        console.log('Using mock data for district prices');
        
        // Filter by city
        const cityProperties = city === 'all' 
          ? mockData 
          : mockData.filter(property => property.city === city);
        
        // Group by district
        const districtGroups = cityProperties.reduce((acc, property) => {
          if (!property.district) return acc;
          
          if (!acc[property.district]) {
            acc[property.district] = {
              district: property.district,
              city: property.city,
              properties: [],
              totalPrice: 0,
              totalArea: 0,
              count: 0
            };
          }
          
          acc[property.district].properties.push(property);
          acc[property.district].totalPrice += property.price;
          acc[property.district].totalArea += property.area;
          acc[property.district].count += 1;
          
          return acc;
        }, {});
        
        // Format district data
        const districtPrices = Object.values(districtGroups).map(group => ({
          district: group.district,
          city: group.city,
          avgPrice: Math.round(group.totalPrice / group.count),
          avgPricePerSqm: Math.round(group.totalPrice / group.totalArea),
          count: group.count
        }));
        
        return districtPrices;
      }
      
      throw error;
    }
  },
  
  /**
   * Get city comparison data
   * @param {Array<string>} cities - City names to compare
   * @param {string} propertyType - Property type filter
   * @returns {Promise<Array>} - City comparison data
   */
  getCityComparison: async (cities, propertyType = 'all') => {
    try {
      const params = {
        cities: cities.join(','),
        propertyType
      };
      
      const response = await apiClient.get('/cities/comparison', { params });
      return response.data;
    } catch (error) {
      console.error('API Error - getCityComparison:', error);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        await mockDelay();
        console.log('Using mock data for city comparison');
        
        // Filter by property type
        let filteredData = propertyType === 'all' 
          ? mockData 
          : mockData.filter(property => property.propertyType === propertyType);
        
        // Group by city
        const cityGroups = filteredData.reduce((acc, property) => {
          if (!cities.includes(property.city) && cities.length > 0) return acc;
          
          if (!acc[property.city]) {
            acc[property.city] = {
              city: property.city,
              properties: [],
              totalPrice: 0,
              totalArea: 0,
              count: 0
            };
          }
          
          acc[property.city].properties.push(property);
          acc[property.city].totalPrice += property.price;
          acc[property.city].totalArea += property.area;
          acc[property.city].count += 1;
          
          return acc;
        }, {});
        
        // Format city comparison data
        const comparisonData = Object.values(cityGroups).map(group => ({
          city: group.city,
          avgPrice: Math.round(group.totalPrice / group.count),
          avgPricePerSqm: Math.round(group.totalPrice / group.totalArea),
          count: group.count,
          priceGrowth: Math.random() * 10 - 2, // Random growth rate between -2% and 8%
          affordabilityIndex: (group.totalPrice / group.count) / 15000, // Mock affordability index
        }));
        
        return comparisonData;
      }
      
      throw error;
    }
  },

  // Add other API methods as needed
};

export default api;