import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { analysisSections } from './sections';

const InvestmentAnalysis = ({ symbol, marketData, historicalData }) => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (symbol) {
      setLoading(true);
      setError(null);
      
      fetch(`/api/test/fundamentals?symbol=${symbol}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch data');
          return res.json();
        })
        .then(data => {
          console.log('Fetched financial data:', data);
          setFinancialData(data);
        })
        .catch(error => {
          console.error('Error fetching fundamentals:', error);
          setError('Failed to load financial data. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [symbol]);

  const handleSectionClick = (sectionId) => {
    setSelectedSection(sectionId);
    if (!financialData) {
      setError('Financial data not available');
      return;
    }

    const section = analysisSections.find(s => s.id === sectionId);
    if (section) {
      try {
        console.log('Financial data structure:', financialData); // Add this debug line
        const analysisResult = section.analyze({ 
          marketData, 
          historicalData, 
          financialData 
        });
        console.log('Analysis result:', analysisResult); // Add this debug line
        setAnalysis(analysisResult);
        setError(null);
      } catch (err) {
        console.error('Analysis error:', err);
        setError('Failed to analyze data for this section');
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white">
            Investment Research Analysis {symbol ? `- ${symbol}` : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysisSections.map((section) => (
                <Button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  disabled={loading}
                  className={`flex items-center justify-between p-4 ${
                    selectedSection === section.id
                      ? 'bg-blue-600/20 border-blue-500/50'
                      : 'bg-black/40 border-white/10 hover:bg-black/60'
                  } border rounded-xl transition-all duration-200`}
                >
                  <div className="flex items-center gap-3">
                    {section.icon}
                    <span className="text-lg">{section.title}</span>
                  </div>
                </Button>
              ))}
            </div>

            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-pulse text-white">Loading analysis...</div>
              </div>
            )}

            {analysis && !loading && (
              <div className="mt-8">
                <Card className="bg-black/40 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-2xl relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 via-yellow-300/20 to-yellow-400/20 
                                    rounded-lg blur-xl opacity-70"></div>
                      <span className="relative text-3xl text-white drop-shadow-[0_0_8px_rgba(255,255,0,0.3)]">
                        {analysis.title}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.metrics && Object.entries(analysis.metrics).map(([category, items]) => (
                        items && items.length > 0 && (
                          <div key={category} className="space-y-4">
                            <h3 className="text-2xl font-semibold text-green-300 capitalize drop-shadow-[0_0_8px_rgba(0,255,0,0.3)]">
                              {category.replace(/([A-Z])/g, ' $1').trim()}
                            </h3>
                            {items.map((item, index) => (
                              <MetricCard key={index} item={item} />
                            ))}
                          </div>
                        )
                      ))}

                      {analysis.indicators?.map((item, index) => (
                        <IndicatorCard key={index} item={item} />
                      ))}

                      {analysis.summary && (
                        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-2 text-white/80 mb-2">
                            <AlertCircle className="w-5 h-5" />
                            <span>Summary</span>
                          </div>
                          <p className="text-white">{analysis.summary}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MetricCard = ({ item }) => (
  <div className="bg-black/20 p-4 rounded-lg">
    <div className="flex justify-between items-center">
      <span className="text-xl text-white/80 drop-shadow-[0_0_4px_rgba(255,255,0,0.15)]">
        {item.metric}
      </span>
      <span className={`px-3 py-1 rounded-full text-sm ${
        item.impact === "Strong" || item.impact === "Positive" 
          ? "bg-green-500/20 text-green-300" 
          : item.impact === "Caution" || item.impact === "Negative"
          ? "bg-yellow-500/20 text-yellow-300"
          : "bg-blue-500/20 text-blue-300"
      }`}>
        {item.value}
      </span>
    </div>
    <div className="mt-2 text-white/70">{item.analysis}</div>
  </div>
);

const IndicatorCard = ({ item }) => (
  <div className="bg-black/20 p-4 rounded-lg">
    <div className="flex justify-between items-center">
      <span className="text-white/80">{item.indicator}</span>
      <span className={`px-3 py-1 rounded-full text-sm ${
        item.signal === "Strong" || item.signal === "Bullish"
          ? "bg-green-500/20 text-green-300"
          : item.signal === "Negative" || item.signal === "Bearish"
          ? "bg-red-500/20 text-red-300"
          : "bg-blue-500/20 text-blue-300"
      }`}>
        {item.value}
      </span>
    </div>
    <div className="mt-2 text-white/70">{item.analysis}</div>
  </div>
);

export default InvestmentAnalysis;