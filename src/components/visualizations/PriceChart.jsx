import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { usePropertyData } from '../../context/DataContext';
import { useFilters } from '../../context/FilterContext';

const PriceChart = ({ chartType = 'line' }) => {
  const { properties, loading } = usePropertyData();
  const { filters } = useFilters();
  const [chartData, setChartData] = useState([]);
  const [selectedView, setSelectedView] = useState('overtime'); // overtime | distribution | comparison

  // Duomenų paruošimas
  useEffect(() => {
    if (!loading && properties.length) {
      // Filtruojame duomenis
      const filteredData = properties.filter(property => {
        // Miesto filtras
        if (filters.city !== 'all' && property.city !== filters.city) return false;
        // Kainos filtras
        if (property.price < filters.priceMin || property.price > filters.priceMax) return false;
        // Ploto filtras
        if (property.area < filters.areaMin || property.area > filters.areaMax) return false;
        return true;
      });

      // Pasirenkame duomenų apdorojimo būdą pagal rodinį
      if (selectedView === 'overtime') {
        // Kainų kitimas bėgant laikui (pagal skelbimo datą)
        // Grupuojame duomenis pagal mėnesį
        const groupedByMonth = filteredData.reduce((acc, property) => {
          const date = new Date(property.listedDate);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          
          if (!acc[monthKey]) {
            acc[monthKey] = {
              month: monthKey,
              avgPrice: 0,
              totalProperties: 0,
              avgPricePerSqm: 0,
              minPrice: Infinity,
              maxPrice: 0
            };
          }
          
          acc[monthKey].totalProperties += 1;
          acc[monthKey].avgPrice += property.price;
          acc[monthKey].avgPricePerSqm += property.price / property.area;
          acc[monthKey].minPrice = Math.min(acc[monthKey].minPrice, property.price);
          acc[monthKey].maxPrice = Math.max(acc[monthKey].maxPrice, property.price);
          
          return acc;
        }, {});
        
        // Apskaičiuojame vidurkius ir formatuojame į masyvą
        const formattedData = Object.values(groupedByMonth)
          .map(group => ({
            ...group,
            avgPrice: Math.round(group.avgPrice / group.totalProperties),
            avgPricePerSqm: Math.round(group.avgPricePerSqm / group.totalProperties)
          }))
          .sort((a, b) => b.avgPrice - a.avgPrice); // Rikiuojame pagal vidutinę kainą mažėjimo tvarka
        
        setChartData(formattedData);
      }
    }
  }, [loading, properties, filters, selectedView]);

  if (loading) {
    return <div className="loading">Kraunama...</div>;
  }

  const renderChart = () => {
    switch (selectedView) {
      case 'overtime':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" tick={{ fontSize: 12 }} height={60} />
              <YAxis 
                yAxisId="left"
                orientation="left"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k €`}
                label={{ value: 'Kaina (€)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => `${value} €/m²`}
                label={{ value: 'Kaina už m² (€)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'avgPrice') return [`${value.toLocaleString()} €`, 'Vid. kaina'];
                  if (name === 'avgPricePerSqm') return [`${value} €/m²`, 'Vid. kaina už m²'];
                  return [value, name];
                }}
                labelFormatter={(label) => {
                  const [year, month] = label.split('-');
                  return `${year} m. ${month} mėn.`;
                }}
              />
              <Legend 
                payload={[
                  { value: 'Vidutinė kaina', type: 'line', color: '#8884d8' },
                  { value: 'Vidutinė kaina už m²', type: 'line', color: '#82ca9d' }
                ]}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="avgPrice" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                name="avgPrice"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="avgPricePerSqm" 
                stroke="#82ca9d" 
                name="avgPricePerSqm"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'distribution':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="interval" angle={-45} textAnchor="end" tick={{ fontSize: 12 }} height={60} />
              <YAxis 
                label={{ value: 'Objektų skaičius', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'count') return [value, 'Objektų skaičius'];
                  return [value, name];
                }}
                labelFormatter={(label) => `Kainų intervalas: ${label}`}
              />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Objektų skaičius" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'comparison':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k €`}
              />
              <YAxis 
                type="category"
                dataKey="city" 
                width={100}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'avgPrice') return [`${value.toLocaleString()} €`, 'Vid. kaina'];
                  if (name === 'avgPricePerSqm') return [`${value} €/m²`, 'Vid. kaina už m²'];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar dataKey="avgPrice" fill="#8884d8" name="Vidutinė kaina" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div>Pasirinkite grafiko tipą</div>;
    }
  };

  return (
    <div className="price-chart-container">
      <div className="chart-controls">
        <h3>NT kainų analizė</h3>
        <div className="view-selector">
          <button 
            className={selectedView === 'overtime' ? 'active' : ''} 
            onClick={() => setSelectedView('overtime')}
          >
            Kainų kitimas laike
          </button>
          <button 
            className={selectedView === 'distribution' ? 'active' : ''} 
            onClick={() => setSelectedView('distribution')}
          >
            Kainų pasiskirstymas
          </button>
          <button 
            className={selectedView === 'comparison' ? 'active' : ''} 
            onClick={() => setSelectedView('comparison')}
          >
            Miestų palyginimas
          </button>
        </div>
      </div>
      
      {renderChart()}
      
      <div className="chart-explanation">
        {selectedView === 'overtime' && (
          <p>Šis grafikas rodo vidutinės NT kainos ir vidutinės kainos už kvadratinį metrą kitimą per laiką.</p>
        )}
        {selectedView === 'distribution' && (
          <p>Šis grafikas rodo NT objektų pasiskirstymą pagal kainų intervalus.</p>
        )}
        {selectedView === 'comparison' && (
          <p>Šis grafikas leidžia palyginti vidutines NT kainas skirtinguose miestuose.</p>
        )}
      </div>
    </div>
  );
};sort((a, b) => a.month.localeCompare(b.month));
        
        setChartData(formattedData);
      } else if (selectedView === 'distribution') {
        // Kainų pasiskirstymas (histograma)
        // Nustatome kainų intervalus
        const minPrice = Math.min(...filteredData.map(p => p.price));
        const maxPrice = Math.max(...filteredData.map(p => p.price));
        const range = maxPrice - minPrice;
        const intervalCount = 10;
        const intervalSize = range / intervalCount;
        
        // Inicializuojame kainų intervalus
        const priceIntervals = Array(intervalCount).fill().map((_, i) => {
          const intervalStart = minPrice + i * intervalSize;
          const intervalEnd = minPrice + (i + 1) * intervalSize;
          return {
            interval: `${Math.round(intervalStart / 1000)}k-${Math.round(intervalEnd / 1000)}k`,
            count: 0,
            minValue: intervalStart,
            maxValue: intervalEnd
          };
        });
        
        // Skaičiuojame kiek objektų patenka į kiekvieną intervalą
        filteredData.forEach(property => {
          const interval = Math.min(
            Math.floor((property.price - minPrice) / intervalSize),
            intervalCount - 1
          );
          priceIntervals[interval].count += 1;
        });
        
        setChartData(priceIntervals);
      } else if (selectedView === 'comparison') {
        // Kainų palyginimas tarp miestų
        // Grupuojame duomenis pagal miestus
        const groupedByCity = filteredData.reduce((acc, property) => {
          if (!acc[property.city]) {
            acc[property.city] = {
              city: property.city,
              avgPrice: 0,
              totalProperties: 0,
              avgPricePerSqm: 0,
              properties: []
            };
          }
          
          acc[property.city].totalProperties += 1;
          acc[property.city].avgPrice += property.price;
          acc[property.city].avgPricePerSqm += property.price / property.area;
          acc[property.city].properties.push(property);
          
          return acc;
        }, {});
        
        // Apskaičiuojame vidurkius
        const formattedData = Object.values(groupedByCity)
          .map(group => ({
            ...group,
            avgPrice: Math.round(group.avgPrice / group.totalProperties),
            avgPricePerSqm: Math.round(group.avgPricePerSqm / group.totalProperties)
          }))
          .