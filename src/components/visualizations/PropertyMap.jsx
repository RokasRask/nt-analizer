import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { usePropertyData } from '../../context/DataContext';
import { useFilters } from '../../context/FilterContext';

// Pataisome Leaflet ikonos problemas
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PropertyMap = () => {
  const mapRef = useRef(null);
  const { properties, loading } = usePropertyData();
  const { filters } = useFilters();
  const [filteredData, setFilteredData] = useState([]);
  const [mapCenter, setMapCenter] = useState([54.687157, 25.279652]); // Vilniaus koordinatės
  const [mapZoom, setMapZoom] = useState(7);

  // Filtruojame duomenis
  useEffect(() => {
    if (!loading && properties.length) {
      const filtered = properties.filter(property => {
        // Miesto filtras
        if (filters.city !== 'all' && property.city !== filters.city) return false;
        
        // Kainos filtras
        if (property.price < filters.priceMin || property.price > filters.priceMax) return false;
        
        return true;
      });
      
      setFilteredData(filtered);
      
      // Jei pasirinktas konkretus miestas, centruojame žemėlapį
      if (filters.city !== 'all') {
        const cityCenters = {
          'Vilnius': [54.687157, 25.279652],
          'Kaunas': [54.8985, 23.9036],
          'Klaipėda': [55.7068, 21.1345],
          'Šiauliai': [55.9349, 23.3137],
          'Panevėžys': [55.7335, 24.3579],
          // Čia galite pridėti daugiau miestų
        };
        
        if (cityCenters[filters.city]) {
          setMapCenter(cityCenters[filters.city]);
          setMapZoom(12);
        }
      } else {
        // Grįžtame į bendrą Lietuvos vaizdą
        setMapCenter([55.1694, 23.8813]);
        setMapZoom(7);
      }
    }
  }, [loading, properties, filters]);

  // Spalvos paskaičiavimas pagal kainą
  const getPriceColor = (price) => {
    // Spalvos gradientas nuo mėlynos (pigiau) iki raudonos (brangiau)
    const minPrice = Math.min(...filteredData.map(p => p.price));
    const maxPrice = Math.max(...filteredData.map(p => p.price));
    const priceRange = maxPrice - minPrice;
    
    // Spalvos paskaičiavimas
    if (priceRange === 0) return '#3388ff'; // Standartinė mėlyna, jei nėra kainų skirtumo
    
    const ratio = (price - minPrice) / priceRange;
    
    // RGB reikšmių paskaičiavimas (mėlyna -> raudona)
    const r = Math.floor(255 * ratio);
    const b = Math.floor(255 * (1 - ratio));
    
    return `rgb(${r}, 40, ${b})`;
  };

  if (loading) {
    return <div className="loading">Kraunamas žemėlapis...</div>;
  }

  return (
    <div className="property-map-container" style={{ height: '600px', width: '100%' }}>
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {filteredData.map((property, index) => (
          property.lat && property.lng ? (
            <CircleMarker 
              key={`property-${index}`}
              center={[property.lat, property.lng]}
              radius={8}
              pathOptions={{
                fillColor: getPriceColor(property.price),
                color: '#333',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
              }}
            >
              <Popup>
                <div className="property-popup">
                  <h3>{property.title}</h3>
                  <p>Kaina: {property.price.toLocaleString()} €</p>
                  <p>Plotas: {property.area} m²</p>
                  <p>Kaina/m²: {Math.round(property.price / property.area)} €/m²</p>
                  <p>Kambariai: {property.rooms}</p>
                  {property.url && (
                    <a href={property.url} target="_blank" rel="noopener noreferrer">
                      Peržiūrėti skelbimą
                    </a>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ) : null
        ))}
      </MapContainer>
      
      <div className="map-legend">
        <h4>Kainos</h4>
        <div className="color-scale">
          <div className="color-item">
            <div className="color-box" style={{ backgroundColor: 'rgb(0, 40, 255)' }}></div>
            <span>Pigiausia</span>
          </div>
          <div className="color-item">
            <div className="color-box" style={{ backgroundColor: 'rgb(128, 40, 128)' }}></div>
            <span>Vidutinė</span>
          </div>
          <div className="color-item">
            <div className="color-box" style={{ backgroundColor: 'rgb(255, 40, 0)' }}></div>
            <span>Brangiausia</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;