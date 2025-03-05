// This is a simple proxy for Yahoo Finance API calls
// No need to import the problematic yahoo-finance2 package here

export default async function handler(req, res) {
  try {
    // Get the Yahoo Finance endpoint from query parameters
    const { symbol, range, interval } = req.query;
    
    // Construct the Yahoo Finance API URL
    const baseUrl = "https://query1.finance.yahoo.com/v8/finance/chart/";
    const url = `${baseUrl}${symbol}?range=${range || '1mo'}&interval=${interval || '1d'}`;
    
    // Fetch data from Yahoo Finance directly
    const response = await fetch(url);
    const data = await response.json();
    
    // Return the data
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching from Yahoo Finance:', error);
    res.status(500).json({ error: 'Failed to fetch data from Yahoo Finance' });
  }
}