import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FREDTest = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const testFRED = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/bonds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: 'series',
          params: {
            series_id: 'GS10'
          }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`${data.error}: ${data.details}`);
      }

      setResult(data);
      console.log('Success:', data);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>FRED API Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={testFRED}
          disabled={loading}
          className="w-full mb-4"
        >
          {loading ? 'Testing...' : 'Test FRED Connection'}
        </Button>

        {error && (
          <div className="p-4 mb-4 bg-red-50 text-red-500 rounded">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-gray-50 rounded">
            <p className="font-semibold mb-2">Response:</p>
            <pre className="overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FREDTest;