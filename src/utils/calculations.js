/**
 * Utility functions for various calculations
 */

/**
 * Calculate price per square meter
 * @param {number} price - Total price
 * @param {number} area - Area in square meters
 * @returns {number} - Price per square meter
 */
export const calculatePricePerSqm = (price, area) => {
    if (!price || !area) return 0;
    return Math.round(price / area);
  };
  
  /**
   * Calculate average value from an array of numbers
   * @param {Array<number>} values - Array of numerical values
   * @returns {number} - Average value
   */
  export const calculateAverage = (values) => {
    if (!values || !values.length) return 0;
    const sum = values.reduce((total, val) => total + (val || 0), 0);
    return sum / values.length;
  };
  
  /**
   * Calculate median value from an array of numbers
   * @param {Array<number>} values - Array of numerical values
   * @returns {number} - Median value
   */
  export const calculateMedian = (values) => {
    if (!values || !values.length) return 0;
    
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    
    return sorted[middle];
  };
  
  /**
   * Calculate price growth percentage
   * @param {number} oldPrice - Original price
   * @param {number} newPrice - New price
   * @returns {number} - Growth percentage
   */
  export const calculateGrowth = (oldPrice, newPrice) => {
    if (!oldPrice || !newPrice) return 0;
    return ((newPrice - oldPrice) / oldPrice) * 100;
  };
  
  /**
   * Calculate affordability index
   * (Based on price-to-income ratio, lower is better)
   * @param {number} propertyPrice - Property price
   * @param {number} annualIncome - Annual income
   * @returns {number} - Affordability index
   */
  export const calculateAffordabilityIndex = (propertyPrice, annualIncome) => {
    if (!propertyPrice || !annualIncome) return 0;
    return (propertyPrice / annualIncome).toFixed(2);
  };
  
  /**
   * Calculate mortgage monthly payment
   * @param {number} loanAmount - Loan amount
   * @param {number} interestRate - Annual interest rate (in percentage)
   * @param {number} loanTermYears - Loan term in years
   * @returns {number} - Monthly payment
   */
  export const calculateMortgagePayment = (loanAmount, interestRate, loanTermYears) => {
    if (!loanAmount || !interestRate || !loanTermYears) return 0;
    
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTermYears * 12;
    
    return (
      loanAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    ).toFixed(2);
  };
  
  /**
   * Calculate rental yield
   * @param {number} annualRent - Annual rental income
   * @param {number} propertyValue - Property value
   * @returns {number} - Rental yield percentage
   */
  export const calculateRentalYield = (annualRent, propertyValue) => {
    if (!annualRent || !propertyValue) return 0;
    return ((annualRent / propertyValue) * 100).toFixed(2);
  };
  
  /**
   * Calculate standard deviation
   * @param {Array<number>} values - Array of numerical values
   * @returns {number} - Standard deviation
   */
  export const calculateStandardDeviation = (values) => {
    if (!values || values.length <= 1) return 0;
    
    const avg = calculateAverage(values);
    const squareDiffs = values.map(value => {
      const diff = value - avg;
      return diff * diff;
    });
    
    const avgSquareDiff = calculateAverage(squareDiffs);
    return Math.sqrt(avgSquareDiff);
  };
  
  /**
   * Calculate percentile value
   * @param {Array<number>} values - Array of numerical values
   * @param {number} percentile - Percentile (0-100)
   * @returns {number} - Value at given percentile
   */
  export const calculatePercentile = (values, percentile) => {
    if (!values || !values.length) return 0;
    
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, Math.min(sorted.length - 1, index))];
  };
  
  /**
   * Calculate return on investment (ROI)
   * @param {number} initialInvestment - Initial investment
   * @param {number} finalValue - Final value
   * @returns {number} - ROI percentage
   */
  export const calculateROI = (initialInvestment, finalValue) => {
    if (!initialInvestment || !finalValue) return 0;
    return (((finalValue - initialInvestment) / initialInvestment) * 100).toFixed(2);
  };
  
  /**
   * Calculate compound annual growth rate (CAGR)
   * @param {number} startValue - Starting value
   * @param {number} endValue - Ending value
   * @param {number} years - Number of years
   * @returns {number} - CAGR percentage
   */
  export const calculateCAGR = (startValue, endValue, years) => {
    if (!startValue || !endValue || !years) return 0;
    return ((Math.pow(endValue / startValue, 1 / years) - 1) * 100).toFixed(2);
  };
  
  /**
   * Group data by a specified key
   * @param {Array<Object>} data - Array of objects
   * @param {string} key - Key to group by
   * @returns {Object} - Grouped data
   */
  export const groupBy = (data, key) => {
    if (!data || !data.length) return {};
    
    return data.reduce((result, item) => {
      const groupKey = item[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {});
  };