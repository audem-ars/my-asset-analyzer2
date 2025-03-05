// netlify/functions/api.js
exports.handler = async function(event, context) {
  const path = event.path.replace('/.netlify/functions/api', '');
  const params = event.queryStringParameters;
  
  // Simple API handler
  try {
    let response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "API is working",
        path: path,
        params: params,
        timestamp: new Date().toISOString()
      })
    };
    
    // Basic routing for different endpoints
    if (path.includes('/stocks')) {
      response.body = JSON.stringify({
        symbol: params.symbol || 'AAPL',
        price: 175.84,
        change: 2.31,
        changePercent: 1.33,
        timestamp: new Date().toISOString()
      });
    } else if (path.includes('/crypto')) {
      response.body = JSON.stringify({
        symbol: params.symbol || 'BTC',
        price: 62345.78,
        change: 1250.43,
        changePercent: 2.05,
        stats: {
          volume: 32450678000,
          marketCap: 1230450000000
        }
      });
    } else if (path.includes('/bonds')) {
      response.body = JSON.stringify([
        { date: '2025-01-01', value: 4.25 },
        { date: '2025-02-01', value: 4.22 },
        { date: '2025-03-01', value: 4.18 }
      ]);
    }
    
    return response;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};