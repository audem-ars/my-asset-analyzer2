// app/api/test/fundamentals/route.js
import { NextResponse } from 'next/server';
const yahooFinance = require('yahoo-finance2').default;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const options = {
  queue: {
    timeout: 30000,  // 30 seconds
    retries: 3,      // Retry 3 times
    retryBackoff: 1000,  // Start with 1 second delay
  }
};

export async function GET(request) {
 const { searchParams } = new URL(request.url);
 const symbol = searchParams.get('symbol');

 if (!symbol) {
   return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
 }

 try {
  const [quote, quoteSummary, historical] = await Promise.all([
    yahooFinance.quote(symbol, options),
    yahooFinance.quoteSummary(symbol, {
      modules: ['financialData', 'incomeStatementHistory', 'defaultKeyStatistics'],
      ...options
    }),
    yahooFinance.historical(symbol, {
      period1: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      period2: new Date(),
      interval: '1d',
      ...options
    })
  ]);
   console.log("QUOTE SUMMARY DATA:", {
     financialData: quoteSummary.financialData,
     incomeStatementDetail: quoteSummary.incomeStatementHistory.incomeStatementHistory.map(statement => ({
       researchDevelopment: statement.researchDevelopment,
       date: statement.endDate
     }))
   });

   if (!quote) {
     throw new Error('No data found');
   }

   // Calculate derived metrics
   const marketCap = quote.marketCap || (quote.regularMarketPrice * quote.sharesOutstanding);
   const yearlyReturn = historical.length >= 2 ? 
     (historical[historical.length - 1].close - historical[0].close) / historical[0].close :
     (quote.regularMarketPrice - quote.fiftyTwoWeekLow) / quote.fiftyTwoWeekLow;

   // Calculate ROIC components
   const ebit = quote.ebitda ? quote.ebitda * 0.85 : marketCap * 0.08; // Estimated EBIT
   const totalAssets = marketCap * 1.5; // Estimated total assets
   const currentLiabilities = totalAssets * 0.2; // Estimated current liabilities
   const investedCapital = totalAssets - currentLiabilities;
   const roic = ebit / investedCapital;

   const fundamentalData = {
     _raw: {
       financialData: {
         currentPrice: quote.regularMarketPrice,
         targetHighPrice: quote.targetHighPrice || quote.regularMarketPrice * 1.2,
         targetLowPrice: quote.targetLowPrice || quote.regularMarketPrice * 0.8,
         targetMedianPrice: quote.targetMedianPrice || quote.regularMarketPrice,
         targetMeanPrice: quote.targetMeanPrice || quote.regularMarketPrice,
         recommendationMean: quote.recommendationMean || 3,
         recommendationKey: quote.recommendationKey || 'hold',
         numberOfAnalystOpinions: quote.numberOfAnalystOpinions || 0,
         totalCash: quote.totalCash || marketCap * 0.1,
         totalDebt: quote.totalDebt || marketCap * 0.2,
         debtToEquity: quote.debtToEquity || 50,
         revenueGrowth: quote.revenueGrowth || yearlyReturn,
         grossMargins: quote.grossMargins || 0.35,
         operatingMargins: quote.operatingMargins || 0.15,
         profitMargins: quote.profitMargins || 0.1,
         ebitda: quote.ebitda || marketCap * 0.08,
         ebitdaMargins: 0.15,
         operatingCashflow: quote.operatingCashflow || marketCap * 0.06,
         freeCashflow: quote.freeCashflow || marketCap * 0.04,
         earningsGrowth: quote.earningsGrowth || yearlyReturn,
         returnOnEquity: quote.returnOnEquity || 0.12,
         returnOnAssets: quote.returnOnAssets || 0.06,
         totalRevenue: quote.totalRevenue || marketCap,
         totalCashPerShare: quote.totalCash ? quote.totalCash / quote.sharesOutstanding : 2,
         currentRatio: quote.currentRatio || 1.5,
         quickRatio: quote.quickRatio || 1.2,
         // Add ROIC components
         totalAssets: totalAssets,
         totalCurrentLiabilities: currentLiabilities,
         ebit: ebit,
         roic: roic,
         netIncome: quote.netIncome || marketCap * 0.05,
         depreciation: totalAssets * 0.03,
         capitalExpenditures: totalAssets * 0.05,
         // Add real R&D data if available
         researchAndDevelopmentExpense: quoteSummary.financialData?.researchDevelopment || 
                                      quoteSummary.incomeStatementHistory?.researchDevelopment || null,
         totalCurrentAssets: totalAssets * 0.3
       },
       keyStats: {
         enterpriseValue: quote.enterpriseValue || marketCap * 1.1,
         forwardPE: quote.forwardPE || quote.trailingPE || 20,
         pegRatio: quote.pegRatio || 1.5,
         priceToBook: quote.priceToBook || 3,
         forwardEps: quote.forwardEps || 1,
         trailingEps: quote.trailingEps || 1,
         enterpriseToRevenue: quote.enterpriseToRevenue || 2.5,
         enterpriseToEbitda: quote.enterpriseToEbitda || 12,
         fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
         fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
         sharesOutstanding: quote.sharesOutstanding,
         marketCap: marketCap,
         beta: quote.beta || 1.1,
         earningsQuarterlyGrowth: quote.earningsQuarterlyGrowth || yearlyReturn / 4,
         priceToSalesTrailing12Months: quote.priceToSalesTrailing12Months || 2.5,
         dividendRate: quote.dividendRate || 0,
         dividendYield: quote.dividendYield || 0,
         payoutRatio: quote.dividendRate && quote.trailingEps ? quote.dividendRate / quote.trailingEps : 
                quote.dividendYield ? quote.dividendYield : 0.25,
         heldPercentInstitutions: quote.heldPercentInstitutions || 0.7,
         heldPercentInsiders: quote.heldPercentInsiders || 0.05,
         shortRatio: quote.shortRatio || 2,
         shortPercentOfFloat: quote.shortPercentOfFloat || 0.05,
         '52WeekChange': yearlyReturn,
         SandP52WeekChange: 0.08,
         floatShares: quote.floatShares || quote.sharesOutstanding
       },
       price: {
         regularMarketPrice: quote.regularMarketPrice,
         regularMarketDayHigh: quote.regularMarketDayHigh,
         regularMarketDayLow: quote.regularMarketDayLow,
         regularMarketVolume: quote.regularMarketVolume,
         regularMarketPreviousClose: quote.regularMarketPreviousClose,
         marketCap: marketCap
       }
     }
   };

   return NextResponse.json(fundamentalData);

 } catch (error) {
   console.error('Fundamentals API Error:', {
     message: error.message,
     stack: error.stack,
     symbol
   });

   return NextResponse.json({
     error: 'Failed to fetch fundamental data',
     details: error.message
   }, { status: 500 });
 }
}