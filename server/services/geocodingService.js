const axios = require('axios');
const NodeGeocoder = require('node-geocoder');

// Geokodavimo paslaugos konfigūracija
const geocoderOptions = {
  provider: process.env.GEOCODER_PROVIDER || 'openstreetmap',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
  timeout: 5000
};

// Sukuriamas geocoder objektas
const geocoder = NodeGeocoder(geocoderOptions);

/**
 * Gauna koordinates pagal adresą
 * @param {string} address - Pilnas adresas
 * @returns {Promise<Object>} - Pažadas su koordinatėmis {lat, lng}
 */
const geocodeAddress = async (address) => {
  try {
    // Pridedama 'Lietuva' prie adreso, jei nėra
    if (!address.toLowerCase().includes('lietuva')) {
      address = `${address}, Lietuva`;
    }

    // Bandymas gauti koordinates
    const results = await geocoder.geocode(address);

    // Jei rezultatų nėra
    if (!results || results.length === 0) {
      console.warn(`Nerasta koordinačių adresui: ${address}`);
      return null;
    }

    // Grąžinamos koordinatės
    return {
      lat: results[0].latitude,
      lng: results[0].longitude
    };
  } catch (error) {
    console.error(`Geokodavimo klaida adresui '${address}':`, error.message);
    return null;
  }
};

/**
 * Gauna adresą pagal koordinates
 * @param {number} lat - Platuma
 * @param {number} lng - Ilguma
 * @returns {Promise<Object>} - Pažadas su adreso duomenimis
 */
const reverseGeocode = async (lat, lng) => {
  try {
    // Bandymas gauti adresą
    const results = await geocoder.reverse({ lat, lon: lng });

    // Jei rezultatų nėra
    if (!results || results.length === 0) {
      console.warn(`Nerasta adreso koordinatėms: ${lat}, ${lng}`);
      return null;
    }

    // Grąžinamas adresas
    return {
      street: results[0].streetName,
      houseNumber: results[0].streetNumber,
      city: results[0].city,
      district: results[0].district,
      region: results[0].state,
      country: results[0].country,
      formattedAddress: results[0].formattedAddress
    };
  } catch (error) {
    console.error(`Atvirkštinio geokodavimo klaida koordinatėms '${lat}, ${lng}':`, error.message);
    return null;
  }
};

/**
 * Apskaičiuoja atstumą tarp dviejų taškų (km)
 * @param {number} lat1 - Pirmo taško platuma
 * @param {number} lng1 - Pirmo taško ilguma
 * @param {number} lat2 - Antro taško platuma
 * @param {number} lng2 - Antro taško ilguma
 * @returns {number} - Atstumas kilometrais
 */
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  // Žemės spindulys (km)
  const R = 6371;
  
  // Kampų konvertavimas iš laipsnių į radianus
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  
  // Haversine formulė
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Atstumas km
  
  return distance;
};

// Pagalbinė funkcija laipsnių konvertavimui į radianus
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

module.exports = {
  geocodeAddress,
  reverseGeocode,
  calculateDistance
};