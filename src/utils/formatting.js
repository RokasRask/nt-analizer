/**
 * Utility functions for data formatting
 */

/**
 * Format price as currency (EUR)
 * @param {number} price - Price value
 * @param {boolean} includeSymbol - Whether to include the currency symbol
 * @returns {string} - Formatted price
 */
export const formatPrice = (price, includeSymbol = true) => {
    if (price === null || price === undefined) return '-';
    
    return new Intl.NumberFormat('lt-LT', {
      style: includeSymbol ? 'currency' : 'decimal',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  /**
   * Format area with unit
   * @param {number} area - Area value
   * @returns {string} - Formatted area
   */
  export const formatArea = (area) => {
    if (area === null || area === undefined) return '-';
    
    return `${area} m²`;
  };
  
  /**
   * Format price per square meter
   * @param {number} price - Price value
   * @param {number} area - Area value
   * @returns {string} - Formatted price per square meter
   */
  export const formatPricePerSqm = (price, area) => {
    if (!price || !area) return '-';
    
    const pricePerSqm = Math.round(price / area);
    return `${formatPrice(pricePerSqm)} / m²`;
  };
  
  /**
   * Format date to localized string
   * @param {string|Date} date - Date to format
   * @param {boolean} includeTime - Whether to include time
   * @returns {string} - Formatted date
   */
  export const formatDate = (date, includeTime = false) => {
    if (!date) return '-';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleDateString('lt-LT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(includeTime && { hour: '2-digit', minute: '2-digit' })
    });
  };
  
  /**
   * Format property type to display name
   * @param {string} type - Property type code
   * @returns {string} - Display name
   */
  export const formatPropertyType = (type) => {
    const types = {
      'flat': 'Butas',
      'house': 'Namas',
      'land': 'Sklypas',
      'commercial': 'Komercinis',
      'cottage': 'Sodyba',
      'garage': 'Garažas',
      'storage': 'Sandėliavimo patalpos'
    };
    
    return types[type] || 'Kita';
  };
  
  /**
   * Truncate text to specified length
   * @param {string} text - Text to truncate
   * @param {number} length - Maximum length
   * @param {string} suffix - Suffix to add when truncated
   * @returns {string} - Truncated text
   */
  export const truncateText = (text, length = 100, suffix = '...') => {
    if (!text) return '';
    
    if (text.length <= length) {
      return text;
    }
    
    return text.substring(0, length).trim() + suffix;
  };
  
  /**
   * Format number with thousands separator
   * @param {number} number - Number to format
   * @returns {string} - Formatted number
   */
  export const formatNumber = (number) => {
    if (number === null || number === undefined) return '-';
    
    return new Intl.NumberFormat('lt-LT').format(number);
  };
  
  /**
   * Format percentage
   * @param {number} value - Percentage value
   * @param {number} decimals - Number of decimal places
   * @returns {string} - Formatted percentage
   */
  export const formatPercentage = (value, decimals = 1) => {
    if (value === null || value === undefined) return '-';
    
    return `${value.toFixed(decimals)}%`;
  };
  
  /**
   * Format month name
   * @param {string} monthStr - Month in format 'YYYY-MM'
   * @returns {string} - Month name with year
   */
  export const formatMonth = (monthStr) => {
    if (!monthStr) return '';
    
    const [year, month] = monthStr.split('-');
    const date = new Date(year, parseInt(month) - 1, 1);
    
    return date.toLocaleDateString('lt-LT', {
      year: 'numeric',
      month: 'long'
    });
  };
  
  /**
   * Get human-readable time ago
   * @param {string|Date} date - Date to calculate from
   * @returns {string} - Human-readable time ago
   */
  export const timeAgo = (date) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const seconds = Math.floor((now - dateObj) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return `${interval} ${interval === 1 ? 'metai' : 'metai'} atgal`;
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return `${interval} ${interval === 1 ? 'mėnuo' : 'mėnesiai'} atgal`;
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return `${interval} ${interval === 1 ? 'diena' : 'dienos'} atgal`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return `${interval} ${interval === 1 ? 'valanda' : 'valandos'} atgal`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return `${interval} ${interval === 1 ? 'minutė' : 'minutės'} atgal`;
    }
    
    return 'Ką tik';
  };