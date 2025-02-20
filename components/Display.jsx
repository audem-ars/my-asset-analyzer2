import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, AlertCircle, ChevronRight } from 'lucide-react';
import { BookOpen, ArrowLeft, LineChart } from 'lucide-react'; // Added LineChart icon
import InvestmentProtocol from './InvestmentProtocol';
import InvestmentAnalysis from './InvestmentAnalysis';


const Display = ({
  assetData,
  assetType,
  selectedBondCategory,
  timeRange,
  chartType,
  yAxisMetric,
  loading,
  error,
  priceChangeColor,
  handleAssetTypeChange,
  handleUpdateChart,
  setTimeRange,
  setChartType,
  setYAxisMetric,
  renderSearchInput,
  renderChart,
  renderTechnicalAnalysis,
  searchProps,
  historicalData, // Add this prop
  marketData, // Add this prop
  financialData // Add this prop
}) => {
  const [showProtocol, setShowProtocol] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Handle Investment Protocol View
  if (showProtocol) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
        <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative p-6 max-w-[1920px] mx-auto space-y-8">
          <Button
            onClick={() => setShowProtocol(false)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Asset Analyzer
          </Button>
          <InvestmentProtocol />
        </div>
      </div>
    );
  }

  // Handle Investment Analysis View
  if (showAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
        <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative p-6 max-w-[1920px] mx-auto space-y-8">
          <Button
            onClick={() => setShowAnalysis(false)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Asset Analyzer
          </Button>
          {assetData.symbol && (
            <InvestmentAnalysis
              symbol={assetData.symbol}
              marketData={marketData}
              historicalData={historicalData?.prices}
              financialData={financialData}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative">
        {/* Your existing content */}
        <div className="relative p-6 max-w-[1920px] mx-auto space-y-8">
          {/* Enhanced Header Section */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/30 via-cyan-400/30 to-blue-400/30 rounded-lg blur-2xl opacity-75"></div>
            <h1 className="relative text-4xl font-bold bg-gradient-to-r from-emerald-200 via-white to-cyan-200 bg-clip-text text-transparent 
                        drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-2">
              Asset Analyzer Pro
            </h1>
          </div>

          <div className="transition-all duration-300">
            {/* Navigation Buttons */}
            <div className="flex justify-end mb-4 gap-4">
              <Button
                onClick={() => setShowAnalysis(true)}
                className="w-full sm:w-auto"
                disabled={!assetData.symbol} // Disable if no asset is selected
              >
                <LineChart className="mr-2 h-5 w-5" />
                Investment Analysis
              </Button>
              <Button
                onClick={() => setShowProtocol(true)}
                className="w-full sm:w-auto"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                View Investment Protocol
              </Button>
            </div>

            {/* Asset Overview Card with Enhanced Glow */}
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-2xl 
                         after:absolute after:inset-0 after:bg-gradient-to-br after:from-blue-500/5 after:to-purple-500/5 after:rounded-lg">
              <CardHeader className="border-b border-white/10 pb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-400/80 to-purple-500/80 backdrop-blur-xl 
                                flex items-center justify-center shadow-lg relative overflow-hidden group">
                      <div className="h-14 px-6 rounded-2xl bg-gradient-to-br from-blue-400/80 to-purple-500/80 backdrop-blur-xl 
                flex items-center justify-center shadow-lg relative overflow-hidden group">
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                  transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
  <span className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent 
                   drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
    {assetData.symbol || 'Asset'}
  </span>
</div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                        {assetData.symbol || 'Select Asset'}
                      </h2>
                      {assetData.overview?.name && (
                        <p className="text-white/60 font-medium">{assetData.overview.name}</p>
                      )}
                    </div>
                  </div>
                  
                  {assetData.price && (
                    <div className="flex items-center gap-6 bg-white/5 p-4 rounded-2xl backdrop-blur-lg border border-white/10 shadow-lg 
                                 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                                  transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <div className="text-right">
                        <div className="text-white/60 text-sm font-medium">Current Price</div>
                        <div className="text-3xl font-bold text-white tracking-tight">
                          ${parseFloat(assetData.price).toFixed(2)}
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm relative overflow-hidden
                                    ${parseFloat(assetData.change) >= 0 
                                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'}`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                                    transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        {parseFloat(assetData.change) >= 0 ? 
                          <TrendingUp className="h-5 w-5" /> : 
                          <TrendingDown className="h-5 w-5" />
                        }
                        <span className="font-bold">{assetData.changePercent}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="mt-6">
              <div className="space-y-6 relative">
  {/* Controls Grid with Enhanced Buttons */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white/5 rounded-2xl backdrop-blur-lg border border-white/10 relative" style={{ isolation: 'isolate' }}>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">Asset Type</label>
                      <select 
  value={assetType} 
  onChange={handleAssetTypeChange}
  className="w-full p-3 rounded-xl bg-[#1a1f2d] border-blue-500/30 text-white 
          focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all
          shadow-[0_0_10px_rgba(59,130,246,0.2)]"
>
                        <option value="stock">Stock</option>
                        <option value="crypto">Cryptocurrency</option>
                        <option value="bond">Bond</option>
                      </select>
                    </div>

                    <div className="space-y-2 relative z-[9999]">
  {renderSearchInput({...searchProps})}
</div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">Time Range</label>
                      <div className="flex gap-3">
                        <select
                          value={timeRange}
                          onChange={(e) => setTimeRange(e.target.value)}
                          className="flex-1 p-3 rounded-xl bg-[#1a1f2d] border-blue-500/30 text-white/90 placeholder-white/30 
                                  focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-lg
                                  shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                        >
                          <option value="7">7 Days</option>
                          <option value="30">30 Days</option>
                          <option value="90">90 Days</option>
                          <option value="180">180 Days</option>
                          <option value="365">1 Year</option>
                          <option value="1825">5 Years</option>
                          <option value="3650">10 Years</option>
                        </select>
                        <Button 
                          onClick={handleUpdateChart}
                          className="relative px-6 py-2 bg-[#1a1f2d] border border-blue-500/30 text-white rounded-xl 
                                   shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] 
                                   transition-all duration-300 hover:bg-[#1e2435] overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                                      transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Chart Controls with Glowing Buttons */}
                  <div className="flex justify-end gap-4 items-center p-4 bg-white/5 rounded-2xl backdrop-blur-lg border border-white/10">
                    {assetType === 'bond' && (
                      <div className="flex-1">
                        <select
                          value={yAxisMetric}
                          onChange={(e) => setYAxisMetric(e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#1a1f2d] border-blue-500/30 text-white/90 placeholder-white/30 
                                  focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-lg
                                  shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                        >
                          <option value="price">Show Price</option>
                          <option value="yield">Show Yield</option>
                        </select>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant={chartType === 'line' ? 'default' : 'outline'}
                        onClick={() => setChartType('line')}
                        className={`relative px-6 py-2 rounded-xl overflow-hidden group ${
                          chartType === 'line' 
                            ? 'bg-[#1a1f2d] border-blue-500/30 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.7)]' 
                            : 'border-white/20 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                                    transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        Line Chart
                      </Button>
                      <Button
                        variant={chartType === 'area' ? 'default' : 'outline'}
                        onClick={() => setChartType('area')}
                        className={`relative px-6 py-2 rounded-xl overflow-hidden group ${
                          chartType === 'area' 
                            ? 'bg-[#1a1f2d] border-blue-500/30 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.7)]' 
                            : 'border-white/20 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                                    transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        Area Chart
                      </Button>
                    </div>
                  </div>

                  {/* Enhanced Alerts */}
                  {error && (
                    <div className="flex items-center gap-3 p-4 text-rose-300 bg-rose-500/10 rounded-2xl border border-rose-500/20 
                                backdrop-blur-sm relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/5 to-transparent 
                                  transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">{error}</span>
                    </div>
                  )}
                  
                  {loading && (
                    <div className="flex items-center justify-center gap-3 p-4 text-blue-300 bg-blue-500/10 rounded-2xl 
                                border border-blue-500/20 backdrop-blur-sm relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent 
                                  transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-b-transparent border-blue-300"></div>
                      <span className="font-medium">Loading asset data...</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Data Display Grid with Enhanced Cards */}
            {(assetData.price || assetData.overview) && (
  <div className="grid grid-cols-1 xl:grid-cols-4 gap-6" style={{ zIndex: 1 }}>
                {/* Market Data Card */}
                <Card className="xl:col-span-1 bg-white/5 backdrop-blur-lg border-white/10 shadow-2xl">
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-purple-400/20 rounded-lg blur-xl opacity-75"></div>
                      <span className="relative text-2xl font-bold bg-gradient-to-r from-blue-200 via-cyan-100 to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                        Market Data
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-white/10">
                      {assetData.overview && Object.entries(assetData.overview).map(([key, value]) => {
                        if (value === null || value === undefined) return null;
                        
                        const formattedKey = key.replace(/([A-Z])/g, ' $1')
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ');

                        let formattedValue = value;
                        if (typeof value === 'number') {
                          if (key.toLowerCase().includes('price') || 
                              key.toLowerCase().includes('value') || 
                              key.toLowerCase().includes('cap') || 
                              key.toLowerCase().includes('volume')) {
                            formattedValue = '$' + value.toLocaleString();
                          } else {
                            formattedValue = value.toLocaleString();
                          }
                        } else if (key.toLowerCase().includes('date')) {
                          formattedValue = new Date(value).toLocaleDateString();
                        } else if (key.toLowerCase().includes('rate') || 
                                 key.toLowerCase().includes('yield')) {
                          formattedValue = value.toString() + '%';
                        }

                        return (
                          <div key={key} className="flex justify-between py-3 px-6 hover:bg-white/5 transition-colors group">
                            <span className="text-white/60 group-hover:text-white/70 transition-colors">{formattedKey}</span>
                            <span className="font-medium text-white/90 group-hover:text-white transition-colors">{formattedValue}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Chart and Technical Analysis */}
                <div className="xl:col-span-3 space-y-6">
                  <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-2xl">
                    <CardHeader className="border-b border-white/10">
                      <CardTitle className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-purple-400/20 rounded-lg blur-xl opacity-75"></div>
                        <span className="relative text-2xl font-bold bg-gradient-to-r from-blue-200 via-cyan-100 to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                          Price Chart
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
                        {renderChart()}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-2xl">
                    <CardHeader className="border-b border-white/10">
                      <CardTitle className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-purple-400/20 rounded-lg blur-xl opacity-75"></div>
                        <span className="relative text-2xl font-bold bg-gradient-to-r from-blue-200 via-cyan-100 to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                          Technical Analysis
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
                        {renderTechnicalAnalysis()}
                      </div>
                    </CardContent>
                  </Card>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Display;