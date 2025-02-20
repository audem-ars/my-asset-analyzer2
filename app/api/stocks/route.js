// app/api/stocks/route.js
import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const type = searchParams.get('type') || 'quote';
  const range = searchParams.get('range') || '1mo';

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    // Handle different types of requests
    switch (type) {
      case 'historical': {
        const endDate = new Date();
        const startDate = new Date();

        // Calculate start date based on range
        switch (range) {
          case '7':
            startDate.setDate(startDate.getDate() - 7);
            break;
          case '30':
            startDate.setMonth(startDate.getMonth() - 1);
            break;
          case '90':
            startDate.setMonth(startDate.getMonth() - 3);
            break;
          case '180':
            startDate.setMonth(startDate.getMonth() - 6);
            break;
          case '365':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
          case '1825':
            startDate.setFullYear(startDate.getFullYear() - 5);
            break;
          case '3650':
            startDate.setFullYear(startDate.getFullYear() - 10);
            break;
          default:
            startDate.setMonth(startDate.getMonth() - 1);
        }

        const historical = await yahooFinance.historical(symbol, {
          period1: startDate,
          period2: endDate,
          interval: '1d'
        });

        if (!Array.isArray(historical)) {
          throw new Error('Invalid historical data format received');
        }

        const formattedData = historical.map(item => ({
          date: item.date.toISOString().split('T')[0],
          value: item.close,
          volume: item.volume,
          open: item.open,
          high: item.high,
          low: item.low
        }));

        return NextResponse.json(formattedData);
      }

      case 'fundamentals': {
        const quote = await yahooFinance.quote(symbol);
        
        // Get additional data for fundamentals
        const fundamentals = {
          // Financial Health
          currentPrice: quote.regularMarketPrice ?? null,
          marketCap: quote.marketCap ?? null,
          trailingPE: quote.trailingPE ?? null,
          forwardPE: quote.forwardPE ?? null,
          priceToBook: quote.priceToBook ?? null,

          // Trading Info
          volume: quote.regularMarketVolume ?? null,
          avgVolume: quote.averageVolume ?? null,
          dayHigh: quote.regularMarketDayHigh ?? null,
          dayLow: quote.regularMarketDayLow ?? null,

          // Performance
          fiftyDayAverage: quote.fiftyDayAverage ?? null,
          twoHundredDayAverage: quote.twoHundredDayAverage ?? null,
          fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh ?? null,
          fiftyTwoWeekLow: quote.fiftyTwoWeekLow ?? null,

          // Additional Info
          beta: quote.beta ?? null,
          dividendRate: quote.dividendRate ?? null,
          dividendYield: quote.dividendYield ?? null,

          // Raw data for debugging
          _raw: quote
        };

        return NextResponse.json(fundamentals);
      }

      case 'enhanced': {
        const quote = await yahooFinance.quote(symbol);
        
        // Get historical data for additional analysis
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        
        const historical = await yahooFinance.historical(symbol, {
          period1: startDate,
          period2: endDate,
          interval: '1d'
        });

        const enhancedFundamentals = {
          // Market Data
          marketData: {
            price: quote.regularMarketPrice ?? null,
            marketCap: quote.marketCap ?? null,
            volume: quote.regularMarketVolume ?? null,
            avgVolume: quote.averageVolume ?? null,
            peRatio: quote.trailingPE ?? null,
            forwardPE: quote.forwardPE ?? null,
            beta: quote.beta ?? null
          },

          // Technical Data
          technicalData: {
            fiftyDayAvg: quote.fiftyDayAverage ?? null,
            twoHundredDayAvg: quote.twoHundredDayAverage ?? null,
            fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh ?? null,
            fiftyTwoWeekLow: quote.fiftyTwoWeekLow ?? null,
            priceToBook: quote.priceToBook ?? null
          },

          // Performance
          performance: {
            dayChange: quote.regularMarketChangePercent ?? null,
            yearToDateChange: calculateYTDChange(historical),
            oneYearReturn: calculateReturn(historical),
            volatility: calculateVolatility(historical)
          },

          // Additional Info
          additionalInfo: {
            sector: quote.sector ?? null,
            industry: quote.industry ?? null,
            longName: quote.longName ?? quote.shortName ?? symbol,
            currency: quote.currency ?? 'USD'
          },

          // Raw data for debugging
          _raw: {
            quote,
            hasHistorical: Boolean(historical)
          }
        };

        return NextResponse.json(enhancedFundamentals);
      }

      default: {
        // Handle basic quote request
        const quote = await yahooFinance.quote(symbol);

        if (!quote) {
          return NextResponse.json({ error: 'No quote data found' }, { status: 404 });
        }

        return NextResponse.json({
          price: quote.regularMarketPrice ?? null,
          change: quote.regularMarketChange ?? null,
          changePercent: quote.regularMarketChangePercent ?? null,
          overview: {
            volume: quote.regularMarketVolume ?? null,
            open: quote.regularMarketOpen ?? null,
            high: quote.regularMarketDayHigh ?? null,
            low: quote.regularMarketDayLow ?? null,
            previousClose: quote.regularMarketPreviousClose ?? null
          },
          symbol: quote.symbol,
          longName: quote.longName ?? quote.shortName ?? quote.symbol
        });
      }
    }

  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      symbol,
      type,
      range
    });

    if (error.message.includes('Not Found')) {
      return NextResponse.json({
        error: `No data found for symbol: ${symbol}`,
        details: error.message
      }, { status: 404 });
    }

    if (error.message.includes('Rate Limit')) {
      return NextResponse.json({
        error: 'API rate limit exceeded. Please try again later.',
        details: error.message
      }, { status: 429 });
    }

    return NextResponse.json({
      error: 'Failed to fetch stock data',
      details: error.message,
      type: type
    }, { status: 500 });
  }
}

// Helper functions for calculations
function calculateVolatility(historical, period = 252) {
  if (!historical || historical.length < period) return null;
  
  const returns = [];
  for (let i = 1; i < historical.length; i++) {
    const dailyReturn = Math.log(historical[i].close / historical[i-1].close);
    returns.push(dailyReturn);
  }
  
  const mean = returns.reduce((a, b) => a + b) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
  return Math.sqrt(variance * 252) * 100; // Annualized and converted to percentage
}

function calculateYTDChange(historical) {
  if (!historical || !historical.length) return null;
  
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const firstPrice = historical.find(h => new Date(h.date) >= startOfYear)?.close;
  const lastPrice = historical[historical.length - 1]?.close;
  
  if (!firstPrice || !lastPrice) return null;
  return ((lastPrice - firstPrice) / firstPrice) * 100;
}

function calculateReturn(historical) {
  if (!historical || historical.length < 2) return null;
  
  const firstPrice = historical[0].close;
  const lastPrice = historical[historical.length - 1].close;
  return ((lastPrice - firstPrice) / firstPrice) * 100;
}