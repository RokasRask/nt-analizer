import React, { useState, useEffect } from 'react';

const AreaFilter = ({ min, max, value, onChange }) => {
  const [localMin, setLocalMin] = useState(value[0]);
  const [localMax, setLocalMax] = useState(value[1]);

  // Atnaujina vietines reikšmes, kai pasikeičia props
  useEffect(() => {
    setLocalMin(value[0]);
    setLocalMax(value[1]);
  }, [value]);

  // Formatuoja plotą
  const formatArea = (area) => {
    return `${area} m²`;
  };

  // Apdoroja min ploto įvesties pakeitimą
  const handleMinChange = (e) => {
    const newValue = parseInt(e.target.value) || min;
    const validValue = Math.max(min, Math.min(newValue, localMax - 1));
    setLocalMin(validValue);
  };

  // Apdoroja max ploto įvesties pakeitimą
  const handleMaxChange = (e) => {
    const newValue = parseInt(e.target.value) || max;
    const validValue = Math.min(max, Math.max(newValue, localMin + 1));
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
    <div className="area-filter filter-group">
      <label>Plotas:</label>
      
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
      
      <div className="area-inputs">
        <div className="area-input-group">
          <label htmlFor="min-area">Nuo:</label>
          <input
            id="min-area"
            type="number"
            value={localMin}
            onChange={handleMinChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            min={min}
            max={localMax - 1}
            step="1"
            className="area-input"
          />
        </div>
        
        <div className="area-input-group">
          <label htmlFor="max-area">Iki:</label>
          <input
            id="max-area"
            type="number"
            value={localMax}
            onChange={handleMaxChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            min={localMin + 1}
            max={max}
            step="1"
            className="area-input"
          />
        </div>
      </div>
      
      <div className="area-range-display">
        <span>{formatArea(localMin)}</span>
        <span> - </span>
        <span>{formatArea(localMax)}</span>
      </div>
    </div>
  );
};

export default AreaFilter;