const rsiStrategy = require('../strategies/rsi');
const emaStrategy = require('../strategies/ema');
const macdStrategy = require('../strategies/macd');
const smartSelector = require('../strategies/smartSelector');

function analyzeMarket(symbol, candlesByTimeFrame) {
  let bestSignal = null;

  for (const tf in candlesByTimeFrame) {
    const candles = candlesByTimeFrame[tf][symbol];
    if (!candles) continue;

    const rsiResult = rsiStrategy(candles);
    const emaResult = emaStrategy(candles);
    const macdResult = macdStrategy(candles);

    const combined = smartSelector([rsiResult, emaResult, macdResult]);

    if (!combined) continue;

    // نقيّم قوة الإشارة ونتأكد انها قوية
    if (!bestSignal || combined.strength > bestSignal.strength) {
      bestSignal = {
        ...combined,
        symbol,
        timeFrame: tf,
        time: candles[candles.length - 1].time
      };
    }
  }

  return bestSignal;
}

module.exports = analyzeMarket;
