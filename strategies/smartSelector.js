const calculateRSI = require('./rsi');
const calculateEMA = require('./ema');
const calculateMACD = require('./macd');

const smartStrategySelector = (candles) => {
  const closes = candles.map(c => c.close);
  const latestCandle = candles[candles.length - 1];

  const rsi = calculateRSI(closes);
  const ema = calculateEMA(closes);
  const macdData = calculateMACD(closes);

  if (!rsi || !ema || !macdData) return null;

  const result = {
    strategy: null,
    signal: null,
    indicators: { rsi, ema, macd: macdData }
  };

  // 🟢 حالة شراء
  if (rsi < 30 && macdData.histogram > 0 && latestCandle.close > ema) {
    result.strategy = 'شراء عند قاع السوق';
    result.signal = 'buy';
  }
  // 🔴 حالة بيع
  else if (rsi > 70 && macdData.histogram < 0 && latestCandle.close < ema) {
    result.strategy = 'بيع عند قمة السوق';
    result.signal = 'sell';
  }
  // ❎ بدون فرصة واضحة
  else {
    result.strategy = 'لا توجد فرصة واضحة';
    result.signal = 'none';
  }

  return result;
};

module.exports = smartStrategySelector;
