// technicalAnalysis.js

// Utility function to calculate mean
const calculateMean = (arr) => {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

// Exponential Moving Average (EMA)
export const calculateEMA = (data, period) => {
  if (!data || data.length < period) return null;
  
  // Extract prices from data (handles both Yahoo Finance and crypto format)
  const prices = data.map(d => parseFloat(d.value || d.close || d));
  const multiplier = 2 / (period + 1);
  
  // First EMA uses SMA as initial value
  let ema = prices.slice(0, period).reduce((a, b) => a + b) / period;
  
  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }
  
  return ema;
};

// Simple Moving Average (SMA)
export const calculateSMA = (data, period) => {
  if (!data || data.length < period) return null;
  
  const prices = data.map(d => parseFloat(d.value || d.close || d));
  return prices.slice(-period).reduce((a, b) => a + b) / period;
};

// Relative Strength Index (RSI)
export const calculateRSI = (data, period = 14) => {
  if (!data || data.length < period + 1) return null;

  const prices = data.map(d => parseFloat(d.value || d.close || d));
  const changes = [];
  
  // Calculate price changes
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  // Separate gains and losses
  const gains = changes.map(change => change > 0 ? change : 0);
  const losses = changes.map(change => change < 0 ? Math.abs(change) : 0);

  // Calculate average gains and losses over the period
  const avgGain = calculateMean(gains.slice(-period));
  const avgLoss = calculateMean(losses.slice(-period));

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

// Moving Average Convergence Divergence (MACD)
export const calculateMACD = (data) => {
  if (!data || data.length < 26) return null;

  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);

  if (!ema12 || !ema26) return null;

  return ema12 - ema26;
};

// Bollinger Bands
export const calculateBollingerBands = (data, period = 20) => {
  if (!data || data.length < period) return null;

  const prices = data.map(d => parseFloat(d.value || d.close || d));
  const sma = calculateSMA(data, period);

  // Calculate standard deviation manually
  const mean = calculateMean(prices.slice(-period));
  const squaredDiffs = prices.slice(-period).map(price => Math.pow(price - mean, 2));
  const standardDeviation = Math.sqrt(calculateMean(squaredDiffs));

  return {
    upper: sma + (standardDeviation * 2),
    middle: sma,
    lower: sma - (standardDeviation * 2)
  };
};

// Average True Range (ATR)
export const calculateATR = (data, period = 14) => {
  if (!data || data.length < period) return null;

  const trueRanges = [];
  
  for (let i = 1; i < data.length; i++) {
    const high = parseFloat(data[i].high || data[i].value || data[i]);
    const low = parseFloat(data[i].low || data[i].value || data[i]);
    const prevClose = parseFloat(data[i-1].close || data[i-1].value || data[i-1]);
    
    const tr1 = high - low;
    const tr2 = Math.abs(high - prevClose);
    const tr3 = Math.abs(low - prevClose);
    
    trueRanges.push(Math.max(tr1, tr2, tr3));
  }

  return calculateMean(trueRanges.slice(-period));
};

// Comprehensive Technical Analysis
export const calculateTechnicalIndicators = (data) => {
  if (!data || !data.length) {
    console.warn('No data provided for technical analysis');
    return null;
  }

  // Debug logging
  console.log('Calculating technical indicators for data:', {
    length: data.length,
    firstPoint: data[0],
    lastPoint: data[data.length - 1]
  });

  try {
    const indicators = {
      movingAverages: {
        sma50: calculateSMA(data, 50)?.toFixed(2),
        sma200: calculateSMA(data, 200)?.toFixed(2),
        ema20: calculateEMA(data, 20)?.toFixed(2),
        dema14: calculateEMA(data, 14)?.toFixed(2),
        tema14: calculateEMA(data, 14)?.toFixed(2),
        vwap: null // Implement if volume data is available
      },
      momentum: {
        rsi: calculateRSI(data)?.toFixed(2),
        macd: calculateMACD(data)?.toFixed(2),
        stochK: null, // Implement if needed
        stochD: null, // Implement if needed
        cci: null // Implement if needed
      },
      volatility: {
        bollingerUpper: calculateBollingerBands(data)?.upper.toFixed(2),
        bollingerLower: calculateBollingerBands(data)?.lower.toFixed(2),
        atr: calculateATR(data)?.toFixed(2),
        keltnerUpper: null // Implement if needed
      },
      volume: {
        obv: null, // Implement if volume data is available
        chaikinOsc: null // Implement if needed
      }
    };

    console.log('Technical indicators calculated:', indicators);
    return indicators;
  } catch (error) {
    console.error('Error calculating technical indicators:', error);
    return null;
  }
};