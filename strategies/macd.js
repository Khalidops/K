const calculateEMA = (data, period) => {
  const k = 2 / (period + 1);
  let ema = data.slice(0, period).reduce((a, b) => a + b) / period;

  for (let i = period; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
  }

  return ema;
};

const calculateMACD = (closes, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) => {
  if (closes.length < longPeriod + signalPeriod) return null;

  const shortEMA = closes.slice(-longPeriod - signalPeriod).map((_, idx, arr) => {
    const start = closes.length - longPeriod - signalPeriod + idx;
    return calculateEMA(closes.slice(start, start + shortPeriod), shortPeriod);
  });

  const longEMA = closes.slice(-longPeriod - signalPeriod).map((_, idx, arr) => {
    const start = closes.length - longPeriod - signalPeriod + idx;
    return calculateEMA(closes.slice(start, start + longPeriod), longPeriod);
  });

  const macdLine = shortEMA.map((val, idx) => val - longEMA[idx]);
  const signalLine = macdLine.slice(-signalPeriod).reduce((a, b) => a + b) / signalPeriod;
  const lastMACD = macdLine[macdLine.length - 1];

  return {
    macd: parseFloat(lastMACD.toFixed(4)),
    signal: parseFloat(signalLine.toFixed(4)),
    histogram: parseFloat((lastMACD - signalLine).toFixed(4))
  };
};

module.exports = calculateMACD;
