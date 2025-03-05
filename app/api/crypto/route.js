import { NextResponse } from 'next/server';

// Mark route as dynamic
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

// Simple mock implementation for build-time compatibility
export async function GET(request) {
  try {
    // Fallback that doesn't rely on URL parameters
    return NextResponse.json({
      message: "This is a fallback crypto API route",
      info: "The real data will be available when deployed",
      mockData: {
        BTC: { price: 57000, change: 1200, changePercent: 2.15 },
        ETH: { price: 3200, change: 45, changePercent: 1.42 },
        SOL: { price: 148, change: 12, changePercent: 8.82 }
      }
    });
  } catch (error) {
    console.error('Crypto API Fallback Error:', error);
    return NextResponse.json({
      error: 'Error in crypto fallback API',
      details: error.message
    }, { status: 500 });
  }
}