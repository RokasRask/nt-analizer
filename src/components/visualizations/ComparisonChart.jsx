import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { fetchDistrictPrices } from '../../api/propertyService';

const ComparisonChart = () => {
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('cities'); // cities | districts | radar
  const [selectedCities, setSelectedCities] = useState(['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys']);
  const [metric, setMetric] = useState('avgPrice'); // avgPrice | avgPricePerSqm
  
  // Miestų spalvos
  const cityColors = {
    'Vilnius': '#8884d8',
    'Kaunas': '#82ca9d',
    'Klaipėda': '#ffc658',
    'Šiauliai': '#ff8042',
    'Panevėžys': '#0088fe',
    'Molėtai': '#00c49f',
    'default': '#8884d8'
  };

  // Duomenų užkrovimas
  useEffect(() => {
    const loadComparisonData = async () => {
      setLoading(true);
      try {
        // Jei pasirinktas miestų palyginimas
        if (viewMode === 'cities') {
          // Gauti visų miestų duomenys
          const allCityData = await fetchDistrictPrices('all');
          
          // Grupuoti pagal miestus
          const citiesData = allCityData.reduce((acc, district) => {
            const city = district.city;
            
            if (!acc[city]) {
              acc[city] = {
                city,
                avgPrice: 0,
                avgPricePerSqm: 0,
                totalProperties: 0,
                districts: []
              };
            }
            
            acc[city].districts.push(district);
            acc[city].totalProperties += district.count;
            acc[city].avgPrice += district.avgPrice * district.count;
            acc[city].avgPricePerSqm += district.avgPricePerSqm * district.count;
            
            return acc;
          }, {});
          
          // Apskaičiuoti galutinius vidurkius
          const formattedData = Object.values(citiesData).map(city => ({
            ...city,
            avgPrice: Math.round(city.avgPrice / city.totalProperties),
            avgPricePerSqm: Math.round(city.avgPricePerSqm / city.totalProperties)
          }));
          
          setComparisonData(formattedData);
        } 
        // Jei pasirinktas rajonų palyginimas
        else if (viewMode === 'districts') {
          // Gauti pasirinkto miesto rajonų duomenys
          const cityToShow = selectedCities.length === 1 ? selectedCities[0] : 'Vilnius';
          const districtsData = await fetchDistrictPrices(cityToShow);
          
          setComparisonData(districtsData);
        }
        // Jei pasirinktas radaro grafikas
        else if (viewMode === 'radar') {
          // Gauti visų miestų duomenys
          const allCityData = await fetchDistrictPrices('all');
          
          // Apdoroti radar grafikui
          const radarData = selectedCities.map(city => {
            const cityDistricts = allCityData.filter(d => d.city === city);
            const avgPrice = cityDistricts.reduce((sum, d) => sum + d.avgPrice * d.count, 0) / 
                            cityDistricts.reduce((sum, d) => sum + d.count, 0);
            const avgPricePerSqm = cityDistricts.reduce((sum, d) => sum + d.avgPricePerSqm * d.count, 0) / 
                                  cityDistricts.reduce((sum, d) => sum + d.count, 0);
            
            return {
              city,
              'Kaina': avgPrice / 1000, // Normalizuojame kainas dėl radaro skalės
              'Kaina/m²': avgPricePerSqm,
              'Pasiūla': cityDistricts.reduce((sum, d) => sum + d.count, 0),
              'Patrauklumas': Math.random() * 10, // Fiktyvūs duomenys demonstracijai
              'Augimas': Math.random() * 10 // Fiktyvūs duomenys demonstracijai
            };
          });
          
          setComparisonData(radarData);
        }
      } catch (err) {
        console.error('Error loading comparison data:', err);
        setError('Nepavyko užkrauti palyginimo duomenų');
      } finally {
        setLoading(false);
      }
    };
    
    loadComparisonData();
  }, [viewMode, selectedCities]);

  // Miesto žymėjimo funkcija
  const handleCityToggle = (city) => {
    if (selectedCities.includes(city)) {
      // Jei jau pažymėtas, pašaliname (bet paliekame bent vieną)
      if (selectedCities.length > 1) {
        setSelectedCities(selectedCities.filter(c => c !== city));
      }
    } else {
      // Pridedame miestą
      setSelectedCities([...selectedCities, city]);
    }
  };

  if (loading) {
    return <div className="loading">Kraunami palyginimo duomenys...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Filtruojame duomenis pagal pasirinktus miestus
  const filteredData = viewMode === 'cities' 
    ? comparisonData.filter(item => selectedCities.includes(item.city))
    : comparisonData;
  
  // Rikiuojame duomenis pagal pasirinktą metriką
  const sortedData = [...filteredData].sort((a, b) => {
    if (viewMode === 'radar') return 0;
    return b[metric] - a[metric];
  });

  const renderChart = () => {
    switch (viewMode) {
      case 'cities':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={sortedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis
                tickFormatter={(value) => {
                  if (metric === 'avgPrice') {
                    return `${(value / 1000).toFixed(0)}k €`;
                  } else {
                    return `${value} €/m²`;
                  }
                }}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === metric) {
                    if (metric === 'avgPrice') {
                      return [`${value.toLocaleString()} €`, 'Vidutinė kaina'];
                    } else {
                      return [`${value} €/m²`, 'Kaina už m²'];
                    }
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Bar 
                dataKey={metric} 
                name={metric === 'avgPrice' ? 'Vidutinė kaina' : 'Kaina už m²'}
              >
                {sortedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={cityColors[entry.city] || cityColors.default} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'districts':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={sortedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(value) => {
                  if (metric === 'avgPrice') {
                    return `${(value / 1000).toFixed(0)}k €`;
                  } else {
                    return `${value} €/m²`;
                  }
                }}
              />
              <YAxis 
                type="category" 
                dataKey="district" 
                width={150}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === metric) {
                    if (metric === 'avgPrice') {
                      return [`${value.toLocaleString()} €`, 'Vidutinė kaina'];
                    } else {
                      return [`${value} €/m²`, 'Kaina už m²'];
                    }
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Bar 
                dataKey={metric} 
                name={metric === 'avgPrice' ? 'Vidutinė kaina' : 'Kaina už m²'}
                fill="#8884d8"
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'radar':
        const radarKeys = ['Kaina', 'Kaina/m²', 'Pasiūla', 'Patrauklumas', 'Augimas'];
        
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart outerRadius={150} data={radarKeys.map(key => {
              const dataPoint = { key };
              sortedData.forEach(city => {
                dataPoint[city.city] = city[key];
              });
              return dataPoint;
            })}>
              <PolarGrid />
              <PolarAngleAxis dataKey="key" />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
              
              {selectedCities.map((city, index) => (
                <Radar
                  key={city}
                  name={city}
                  dataKey={city}
                  stroke={cityColors[city] || cityColors.default}
                  fill={cityColors[city] || cityColors.default}
                  fillOpacity={0.6}
                />
              ))}
              
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div>Pasirinkite grafiko tipą</div>;
    }
  };

  return (
    <div className="comparison-chart-container">
      <div className="chart-controls">
        <div className="view-mode-selector">
          <button
            className={viewMode === 'cities' ? 'active' : ''}
            onClick={() => setViewMode('cities')}
          >
            Miestų palyginimas
          </button>
          <button
            className={viewMode === 'districts' ? 'active' : ''}
            onClick={() => setViewMode('districts')}
          >
            Rajonų palyginimas
          </button>
          <button
            className={viewMode === 'radar' ? 'active' : ''}
            onClick={() => setViewMode('radar')}
          >
            Radar grafikas
          </button>
        </div>
        
        <div className="metric-selector">
          {viewMode !== 'radar' && (
            <>
              <button
                className={metric === 'avgPrice' ? 'active' : ''}
                onClick={() => setMetric('avgPrice')}
              >
                Vidutinė kaina
              </button>
              <button
                className={metric === 'avgPricePerSqm' ? 'active' : ''}
                onClick={() => setMetric('avgPricePerSqm')}
              >
                Kaina už m²
              </button>
            </>
          )}
        </div>
        
        <div className="city-selector">
          {viewMode === 'cities' || viewMode === 'radar' ? (
            <div className="city-checkboxes">
              <span>Pasirinkite miestus:</span>
              {Object.keys(cityColors).filter(city => city !== 'default').map(city => (
                <label key={city}>
                  <input
                    type="checkbox"
                    checked={selectedCities.includes(city)}
                    onChange={() => handleCityToggle(city)}
                    disabled={selectedCities.length === 1 && selectedCities.includes(city)}
                  />
                  <span style={{ color: cityColors[city] }}>{city}</span>
                </label>
              ))}
            </div>
          ) : viewMode === 'districts' ? (
            <div className="city-selector-dropdown">
              <label>
                Pasirinkite miestą:
                <select
                  value={selectedCities[0]}
                  onChange={(e) => setSelectedCities([e.target.value])}
                >
                  {Object.keys(cityColors).filter(city => city !== 'default').map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}
        </div>
      </div>

      {renderChart()}
      
      <div className="chart-explanation">
        {viewMode === 'cities' && (
          <p>Šis grafikas palygina vidutines NT kainas skirtinguose Lietuvos miestuose.</p>
        )}
        {viewMode === 'districts' && (
          <p>Šis grafikas rodo NT kainų pasiskirstymą skirtinguose {selectedCities[0]} miesto rajonuose.</p>
        )}
        {viewMode === 'radar' && (
          <p>Radaro grafikas leidžia palyginti miestus pagal skirtingus parametrus vienu metu.</p>
        )}
      </div>
    </div>
  );
};

export default ComparisonChart;