import { NextResponse } from 'next/server';

// Simplified test route without yahoo-finance2 dependency
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'AAPL';

  try {
    // Return mock fundamentals data
    return NextResponse.json({
      symbol,
      price: 150 + Math.random() * 20,
      marketCap: "2.45T",
      pe: 28.5,
      dividend: 0.92,
      eps: 6.14,
      high52: 175.84,
      low52: 124.76,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in enhanced fundamentals test:', error);
    return NextResponse.json({
      error: 'Test failed',
      details: error.message
    }, { status: 500 });
  }
}