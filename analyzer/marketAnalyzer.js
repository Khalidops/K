// analyzer.js

const axios = require('axios');
const { MACD, RSI, EMA } = require('technicalindicators');

// العملات المطلوب تحليلها
const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'NZDUSD'];

// الدالة الرئيسية للتحليل
async function analyzeMarket() {
  const results = [];

  for (const symbol of symbols) {
    try {
      const candles = await getCandles(symbol);
      if (!candles || candles.length < 26) continue;

      const closePrices = candles.map(c => c.close);

      // المؤشرات
      const macd = MACD.calculate({
        values: closePrices,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        SimpleMAOscillator: false,
        SimpleMASignal: false
      });

      const rsi = RSI.calculate({ values: closePrices, period: 14 });
      const ema = EMA.calculate({ values: closePrices, period: 9 });

      const lastClose = closePrices[closePrices.length - 1];
      const lastMACD = macd[macd.length - 1];
      const lastRSI = rsi[rsi.length - 1];
      const lastEMA = ema[ema.length - 1];

      // شروط استراتيجية ذكية
      let direction = null;
      let strength = 0;

      if (lastMACD && lastMACD.histogram > 0 && lastRSI < 70 && lastClose > lastEMA) {
        direction = 'buy';
        strength = Math.round(Math.min(100, lastMACD.histogram * 100));
      } else if (lastMACD && lastMACD.histogram < 0 && lastRSI > 30 && lastClose < lastEMA) {
        direction = 'sell';
        strength = Math.round(Math.min(100, Math.abs(lastMACD.histogram * 100)));
      }

      if (direction && strength >= 75) {
        results.push({ symbol, direction, strength, strong: true });
      }

    } catch (err) {
      console.error(`❌ خطأ في تحليل ${symbol}:`, err.message);
    }
  }

  return results;
}

// الدالة الوهمية المؤقتة للشموع (إلى أن نربط API حقيقي)
async function getCandles(symbol) {
  // هذا مجرد مثال بسيط لشموع تجريبية
  const candles = [];
  const now = Date.now();
  for (let i = 0; i < 30; i++) {
    const base = 1 + Math.random() * 0.01;
    candles.push({
      time: new Date(now - i * 60000).toISOString(),
      open: base,
      high: base + 0.001,
      low: base - 0.001,
      close: base + (Math.random() - 0.5) * 0.002
    });
  }
  return candles.reverse();
}

module.exports = { analyzeMarket };
