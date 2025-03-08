import React, { useState, useEffect } from 'react';

const PriceFilter = ({ min, max, value, onChange }) => {
  const [localMin, setLocalMin] = useState(value[0]);
  const [localMax, setLocalMax] = useState(value[1]);

  // Atnaujina vietines reikšmes, kai pasikeičia props
  useEffect(() => {
    setLocalMin(value[0]);
    setLocalMax(value[1]);
  }, [value]);

  // Formatuoja kainą kaip EUR
  const formatPrice = (price) => {
    return new Intl.NumberFormat('lt-LT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Apdoroja min kainos įvesties pakeitimą
  const handleMinChange = (e) => {
    const newValue = parseInt(e.target.value) || min;
    const validValue = Math.max(min, Math.min(newValue, localMax - 1000));
    setLocalMin(validValue);
  };

  // Apdoroja max kainos įvesties pakeitimą
  const handleMaxChange = (e) => {
    const newValue = parseInt(e.target.value) || max;
    const validValue = Math.min(max, Math.max(newValue, localMin + 1000));
    setLocalMax(validValue);
  };

  // Apdoroja min slankiklio pakeitimą
  const handleMinSliderChange = (e) => {
    const newValue = parseInt(e.target.value);
    setLocalMin(newValue);
  };

  // Apdoroja max slankiklio pakeitimą
  const handleMaxSliderChange = (e) => {
    const newValue = parseInt(e.target.value);
    setLocalMax(newValue);
  };

  // Išsiunčia pakeitimus į tėvinį komponentą, kai atleidžiame slankiklį
  const handleSliderRelease = () => {
    onChange([localMin, localMax]);
  };

  // Išsiunčia pakeitimus į tėvinį komponentą, kai paspaudžiame Enter įvesties lauke
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      onChange([localMin, localMax]);
    }
  };

  // Išsiunčia pakeitimus į tėvinį komponentą, kai išeiname iš įvesties lauko
  const handleInputBlur = () => {
    onChange([localMin, localMax]);
  };

  return (
    <div className="price-filter filter-group">
      <label>Kaina:</label>
      
      <div className="slider-container">
        <input
          type="range"
          min={min}
          max={max}
          value={localMin}
          onChange={handleMinSliderChange}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          className="slider min-slider"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localMax}
          onChange={handleMaxSliderChange}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          className="slider max-slider"
        />
      </div>
      
      <div className="price-inputs">
        <div className="price-input-group">
          <label htmlFor="min-price">Nuo:</label>
          <input
            id="min-price"
            type="number"
            value={localMin}
            onChange={handleMinChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            min={min}
            max={localMax - 1000}
            step="1000"
            className="price-input"
          />
        </div>
        
        <div className="price-input-group">
          <label htmlFor="max-price">Iki:</label>
          <input
            id="max-price"
            type="number"
            value={localMax}
            onChange={handleMaxChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            min={localMin + 1000}
            max={max}
            step="1000"
            className="price-input"
          />
        </div>
      </div>
      
      <div className="price-range-display">
        <span>{formatPrice(localMin)}</span>
        <span> - </span>
        <span>{formatPrice(localMax)}</span>
      </div>
    </div>
  );
};

export default PriceFilter;