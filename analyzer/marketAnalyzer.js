const smartStrategySelector = require('../strategies/smartSelector');

const analyzeMarket = (symbol, candles) => {
  if (!candles || candles.length < 30) return null;

  const decision = smartStrategySelector(candles);
  if (!decision || decision.signal === 'none') return null;

  const lastCandle = candles[candles.length - 1];
  const price = lastCandle.close;
  const time = lastCandle.time;

  return {
    symbol,
    time,
    signal: decision.signal,
    strategy: decision.strategy,
    indicators: decision.indicators,
    price,
  };
};

module.exports = analyzeMarket;
