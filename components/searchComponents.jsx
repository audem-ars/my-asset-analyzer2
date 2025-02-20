import React from 'react';
import { Input } from '@/components/ui/input';
import { cryptoMap } from './cryptoMap';
import { stockSymbols } from './stockUtils';
import { bondCategories } from './bondUtils';

export const BondSearch = ({ 
  selectedBondCategory, 
  setSelectedBondCategory, 
  assetData, 
  setAssetData, 
  handleBondFetch 
}) => {
  return (
    <div className="relative isolate" style={{ zIndex: 50 }}>
      <div className="w-full space-y-2">
        <select
          value={selectedBondCategory}
          onChange={(e) => setSelectedBondCategory(e.target.value)}
          className="w-full p-3 rounded-xl bg-[#1a1f2d] border-blue-500/30 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
        >
          <option value="">All Bond Categories</option>
          {Object.entries(bondCategories).map(([category, data]) => (
            <option key={category} value={category}>
              {data.name}
            </option>
          ))}
        </select>

        <Input
          type="text"
          placeholder="Search bonds"
          value={assetData.symbol}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            setAssetData(prev => ({ ...prev, symbol: value }));
            
            if (value.length > 0) {
              document.getElementById('bond-list').style.display = 'block';
            } else {
              document.getElementById('bond-list').style.display = 'none';
            }
          }}
          className="w-full rounded-xl bg-[#1a1f2d] border-blue-500/30 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
        />
      </div>
      <div 
        id="bond-list"
        className="absolute w-full bg-[#1a1f2d] border border-blue-500/30 rounded-xl shadow-lg hidden max-h-60 overflow-auto"
        style={{
          top: '100%',
          left: 0,
          marginTop: '4px',
          zIndex: 100
        }}
      >
        {Object.entries(bondCategories)
          .filter(([category]) => !selectedBondCategory || category === selectedBondCategory)
          .map(([category, data]) => (
            <div key={category}>
              <div className="px-4 py-2 bg-[#232936] font-semibold text-white">
                {data.name}
                <span className="text-sm text-white/60 ml-2">
                  {data.description}
                </span>
              </div>
              {Object.entries(data.symbols)
                .filter(([symbol, name]) => 
                  !assetData.symbol ||
                  symbol.includes(assetData.symbol) || 
                  name.toLowerCase().includes(assetData.symbol.toLowerCase())
                )
                .map(([symbol, name]) => (
                  <div
                    key={symbol}
                    className="px-4 py-2 hover:bg-blue-500/20 cursor-pointer text-white"
                    onClick={() => {
                      setAssetData(prev => ({ ...prev, symbol }));
                      document.getElementById('bond-list').style.display = 'none';
                      handleBondFetch(symbol);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-white">{symbol}</span>
                      <span className="text-white/60 text-sm">{name}</span>
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export const StockSearch = ({ 
    assetData, 
    setAssetData, 
    handleStockFetch, 
    timeRange, 
    setLoading, 
    setError, 
    setHistoricalData 
}) => {
  return (
    <div className="relative isolate" style={{ zIndex: 50 }}>
      <div className="w-full">
        <Input
          type="text"
          placeholder="Search stocks (e.g., AAPL)"
          value={assetData.symbol}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            setAssetData(prev => ({ ...prev, symbol: value }));
            
            if (value.length > 0) {
              document.getElementById('stock-list').style.display = 'block';
            } else {
              document.getElementById('stock-list').style.display = 'none';
            }
          }}
          className="w-full rounded-xl bg-[#1a1f2d] border-blue-500/30 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
        />
      </div>
      <div 
        id="stock-list"
        className="absolute w-full bg-[#1a1f2d] border border-blue-500/30 rounded-xl shadow-lg hidden max-h-60 overflow-auto"
        style={{
          top: '100%',
          left: 0,
          marginTop: '4px',
          zIndex: 100
        }}
      >
        {stockSymbols
          .filter(symbol => symbol.includes(assetData.symbol))
          .map(symbol => (
            <div
              key={symbol}
              className="px-4 py-2 hover:bg-blue-500/20 cursor-pointer text-white"
              onClick={() => {
                setAssetData(prev => ({ ...prev, symbol }));
                document.getElementById('stock-list').style.display = 'none';
                handleStockFetch(symbol, timeRange, {
                  setLoading,
                  setError,
                  setAssetData,
                  setHistoricalData
                });
              }}
            >
              <span className="font-medium text-white">{symbol}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export const CryptoSearch = ({ assetData, setAssetData, fetchCryptoData }) => {
  return (
    <div className="relative isolate" style={{ zIndex: 50 }}>
      <div className="w-full">
        <Input
          type="text"
          placeholder="Search crypto (e.g., BTC)"
          value={assetData.symbol}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            setAssetData(prev => ({ ...prev, symbol: value }));
            
            if (value.length > 0) {
              document.getElementById('crypto-list').style.display = 'block';
            } else {
              document.getElementById('crypto-list').style.display = 'none';
            }
          }}
          className="w-full rounded-xl bg-[#1a1f2d] border-blue-500/30 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
        />
      </div>
      <div 
        id="crypto-list"
        className="absolute w-full bg-[#1a1f2d] border border-blue-500/30 rounded-xl shadow-lg hidden max-h-60 overflow-auto"
        style={{
          top: '100%',
          left: 0,
          marginTop: '4px',
          zIndex: 100
        }}
      >
        {Object.entries(cryptoMap)
          .filter(([symbol, name]) => 
            symbol.includes(assetData.symbol) || 
            name.toLowerCase().includes(assetData.symbol.toLowerCase())
          )
          .map(([symbol, name]) => (
            <div
              key={symbol}
              className="px-4 py-2 hover:bg-blue-500/20 cursor-pointer text-white flex justify-between items-center"
              onClick={() => {
                setAssetData(prev => ({ ...prev, symbol }));
                document.getElementById('crypto-list').style.display = 'none';
                fetchCryptoData(symbol);
              }}
            >
              <span className="font-medium text-white">{symbol}</span>
              <span className="text-white/60">
                {name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export const renderSearchInput = ({ 
    assetType, 
    selectedBondCategory, 
    setSelectedBondCategory, 
    assetData, 
    setAssetData, 
    handleBondFetch, 
    handleStockFetch, 
    fetchCryptoData,
    timeRange,
    setLoading,
    setError,
    setHistoricalData
}) => {
  switch(assetType) {
    case 'bond':
      return (
        <BondSearch
          selectedBondCategory={selectedBondCategory}
          setSelectedBondCategory={setSelectedBondCategory}
          assetData={assetData}
          setAssetData={setAssetData}
          handleBondFetch={handleBondFetch}
        />
      );
    case 'stock':
      return (
        <StockSearch
          assetData={assetData}
          setAssetData={setAssetData}
          handleStockFetch={handleStockFetch}
          timeRange={timeRange}
          setLoading={setLoading}
          setError={setError}
          setHistoricalData={setHistoricalData}
        />
      );
    case 'crypto':
      return (
        <CryptoSearch
          assetData={assetData}
          setAssetData={setAssetData}
          fetchCryptoData={fetchCryptoData}
        />
      );
    default:
      return null;
  }
};