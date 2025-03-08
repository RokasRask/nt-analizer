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
  ReferenceLine
} from 'recharts';
import { fetchPriceTrends } from '../../api/propertyService';
import { useFilters } from '../../context/FilterContext';

const TrendChart = () => {
  const { filters } = useFilters();
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metric, setMetric] = useState('avgPrice'); // avgPrice | avgPricePerSqm
  const [showPrediction, setShowPrediction] = useState(false);

  // Duomenų užkrovimas
  useEffect(() => {
    const loadTrendData = async () => {
      setLoading(true);
      try {
        // Gaunami tendencijų duomenys
        const data = await fetchPriceTrends({
          city: filters.city,
          propertyType: filters.propertyType
        });
        
        // Pridedami prognozuojami duomenys
        if (showPrediction) {
          const lastMonth = data[data.length - 1];
          const lastMonthDate = new Date(lastMonth.month + '-01');
          
          // Pridedame 6 mėnesius prognozės
          for (let i = 1; i <= 6; i++) {
            const predictionDate = new Date(lastMonthDate);
            predictionDate.setMonth(lastMonthDate.getMonth() + i);
            
            const monthKey = `${predictionDate.getFullYear()}-${String(predictionDate.getMonth() + 1).padStart(2, '0')}`;
            
            // Labai paprastas tiesinis augimas prognozei (realiai čia būtų sudėtingesnis modelis)
            const avgPriceGrowth = (lastMonth.avgPrice * 0.01) * i; // 1% per mėnesį
            const avgPricePerSqmGrowth = (lastMonth.avgPricePerSqm * 0.01) * i; // 1% per mėnesį
            
            data.push({
              month: monthKey,
              avgPrice: Math.round(lastMonth.avgPrice + avgPriceGrowth),
              avgPricePerSqm: Math.round(lastMonth.avgPricePerSqm + avgPricePerSqmGrowth),
              isPrediction: true
            });
          }
        }
        
        setTrendData(data);
      } catch (err) {
        console.error('Error loading trend data:', err);
        setError('Nepavyko užkrauti tendencijų duomenų');
      } finally {
        setLoading(false);
      }
    };
    
    loadTrendData();
  }, [filters.city, filters.propertyType, showPrediction]);

  // Formatuoja mėnesio pavadinimą
  const formatMonth = (month) => {
    if (!month) return '';
    
    const [year, monthNum] = month.split('-');
    const monthNames = [
      'Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis',
      'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'
    ];
    
    return `${monthNames[parseInt(monthNum) - 1]} ${year}`;
  };

  if (loading) {
    return <div className="loading">Kraunami tendencijų duomenys...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Nustatome, kur prasideda prognozės duomenys (jei yra)
  const predictionStartIndex = trendData.findIndex(item => item.isPrediction);

  return (
    <div className="trend-chart-container">
      <div className="chart-controls">
        <div className="metric-selector">
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
        </div>
        
        <div className="prediction-toggle">
          <label>
            <input
              type="checkbox"
              checked={showPrediction}
              onChange={(e) => setShowPrediction(e.target.checked)}
            />
            Rodyti prognozę
          </label>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            angle={-45} 
            textAnchor="end" 
            tick={{ fontSize: 12 }} 
            height={60}
            tickFormatter={formatMonth}
          />
          <YAxis
            domain={[
              dataMin => Math.floor(dataMin * 0.95),
              dataMax => Math.ceil(dataMax * 1.05)
            ]}
            tickFormatter={(value) => {
              if (metric === 'avgPrice') {
                return `${(value / 1000).toFixed(0)}k €`;
              } else {
                return `${value} €/m²`;
              }
            }}
            label={{ 
              value: metric === 'avgPrice' ? 'Kaina (€)' : 'Kaina už m² (€)', 
              angle: -90, 
              position: 'insideLeft' 
            }}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === 'Vidutinė kaina') return [`${value.toLocaleString()} €`, name];
              if (name === 'Kaina už m²') return [`${value} €/m²`, name];
              if (name === 'Prognozė (kaina)') return [`${value.toLocaleString()} €`, name];
              if (name === 'Prognozė (kaina už m²)') return [`${value} €/m²`, name];
              return [value, name];
            }}
            labelFormatter={formatMonth}
          />
          <Legend />
          
          {/* Faktiniai duomenys */}
          <Line 
            type="monotone" 
            dataKey={metric}
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            name={metric === 'avgPrice' ? 'Vidutinė kaina' : 'Kaina už m²'}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          
          {/* Prognozės duomenys */}
          {showPrediction && predictionStartIndex >= 0 && (
            <Line 
              type="monotone" 
              dataKey={metric}
              stroke="#82ca9d" 
              strokeDasharray="5 5"
              activeDot={{ r: 6 }} 
              name={metric === 'avgPrice' ? 'Prognozė (kaina)' : 'Prognozė (kaina už m²)'}
              dot={{ r: 3 }}
              data={trendData.filter(item => item.isPrediction)}
            />
          )}
          
          {/* Atskirimo linija tarp faktinių duomenų ir prognozės */}
          {showPrediction && predictionStartIndex >= 0 && (
            <ReferenceLine 
              x={trendData[predictionStartIndex].month} 
              stroke="#ff7300" 
              strokeDasharray="3 3"
              label={{ value: 'Prognozė', position: 'insideTopRight' }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      
      <div className="chart-explanation">
        <p>
          Šis grafikas rodo NT kainų tendencijas per laiką. 
          {showPrediction && ' Prognozės dalyje pateikiama galima kainų raida artimiausiais mėnesiais.'}
        </p>
        <p className="data-source">
          <small>Duomenų šaltinis: Aruodas.lt duomenų analizė</small>
        </p>
      </div>
    </div>
  );
};

export default TrendChart;