/**
 * Utility functions for map operations
 */
import regions from '../data/regions';

/**
 * Get coordinates for a city center
 * @param {string} city - City name
 * @returns {Array<number>} - [latitude, longitude]
 */
export const getCityCenter = (city) => {
  if (!city || city === 'all') {
    // Return Lithuania's center
    return [55.1694, 23.8813];
  }
  
  return regions[city]?.center || [55.1694, 23.8813];
};

/**
 * Get coordinates for a district
 * @param {string} city - City name
 * @param {string} district - District name
 * @returns {Array<number>} - [latitude, longitude]
 */
export const getDistrictCoordinates = (city, district) => {
  if (!city || !district) return null;
  
  return regions[city]?.districts?.[district] || null;
};

/**
 * Get appropriate zoom level based on the view type
 * @param {string} view - View type (country, city, district)
 * @returns {number} - Zoom level
 */
export const getZoomLevel = (view) => {
  switch (view) {
    case 'country':
      return 7;
    case 'city':
      return 11;
    case 'district':
      return 14;
    default:
      return 7;
  }
};

/**
 * Calculate the bounding box for a set of coordinates
 * @param {Array<Array<number>>} coordinates - Array of [lat, lng] coordinates
 * @returns {Array<Array<number>>} - [[min_lat, min_lng], [max_lat, max_lng]]
 */
export const getBoundingBox = (coordinates) => {
  if (!coordinates || !coordinates.length) return null;
  
  const lats = coordinates.map(coord => coord[0]);
  const lngs = coordinates.map(coord => coord[1]);
  
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  
  return [[minLat, minLng], [maxLat, maxLng]];
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {Array<number>} coord1 - First coordinate [lat, lng]
 * @param {Array<number>} coord2 - Second coordinate [lat, lng]
 * @returns {number} - Distance in kilometers
 */
export const calculateDistance = (coord1, coord2) => {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} - Angle in radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Get color for a price on the map
 * @param {number} price - Property price
 * @param {number} minPrice - Minimum price in dataset
 * @param {number} maxPrice - Maximum price in dataset
 * @returns {string} - Color in hex format
 */
export const getPriceColor = (price, minPrice, maxPrice) => {
  if (!price || !minPrice || !maxPrice) return '#3388ff'; // Default blue
  
  // Normalize price between 0 and 1
  const normalizedPrice = (price - minPrice) / (maxPrice - minPrice);
  
  // Blue to red gradient
  const r = Math.floor(normalizedPrice * 255);
  const g = Math.floor(40);
  const b = Math.floor((1 - normalizedPrice) * 255);
  
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Cluster properties by proximity
 * @param {Array<Object>} properties - Property objects with coordinates
 * @param {number} radius - Clustering radius in kilometers
 * @returns {Array<Object>} - Clustered properties
 */
export const clusterProperties = (properties, radius = 0.5) => {
  if (!properties || !properties.length) return [];
  
  const clusters = [];
  const processed = new Set();
  
  properties.forEach((property, index) => {
    if (processed.has(index)) return;
    
    const cluster = {
      center: [property.lat, property.lng],
      properties: [property],
      count: 1
    };
    
    processed.add(index);
    
    // Find nearby properties
    properties.forEach((otherProperty, otherIndex) => {
      if (processed.has(otherIndex)) return;
      
      const distance = calculateDistance(
        [property.lat, property.lng],
        [otherProperty.lat, otherProperty.lng]
      );
      
      if (distance <= radius) {
        cluster.properties.push(otherProperty);
        cluster.count += 1;
        processed.add(otherIndex);
      }
    });
    
    // Calculate average price and other metrics
    cluster.avgPrice = cluster.properties.reduce((sum, prop) => sum + prop.price, 0) / cluster.count;
    
    clusters.push(cluster);
  });
  
  return clusters;
};

/**
 * Generate heatmap data from properties
 * @param {Array<Object>} properties - Property objects
 * @param {string} valueField - Field to use for intensity
 * @returns {Array<Object>} - Heatmap data points
 */
export const generateHeatmapData = (properties, valueField = 'price') => {
  if (!properties || !properties.length) return [];
  
  return properties.map(property => ({
    lat: property.lat,
    lng: property.lng,
    intensity: property[valueField] || 1
  }));
};

/**
 * Check if coordinates are valid
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} - Whether coordinates are valid
 */
export const isValidCoordinates = (lat, lng) => {
  return (
    lat !== null &&
    lng !== null &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};