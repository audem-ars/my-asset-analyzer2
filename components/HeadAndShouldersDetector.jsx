import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ReferenceArea } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const HeadAndShouldersDetector = ({ data }) => {
  const [pattern, setPattern] = useState(null);
  const [neckline, setNeckline] = useState(null);

  useEffect(() => {
    detectPattern(data);
  }, [data]);

  const detectPattern = (priceData) => {
    if (!priceData || priceData.length < 20) return;

    // Find local maxima and minima
    const peaks = findPeaksAndTroughs(priceData);
    
    // Look for head and shoulders pattern
    for (let i = 0; i < peaks.length - 4; i++) {
      const potentialLeftShoulder = peaks[i];
      const potentialHead = peaks[i + 1];
      const potentialRightShoulder = peaks[i + 2];
      
      // Check if we have a valid formation
      if (isValidHeadAndShoulders(
        potentialLeftShoulder,
        potentialHead,
        potentialRightShoulder,
        priceData
      )) {
        // Calculate neckline
        const necklineStart = findNecklinePoint(potentialLeftShoulder, priceData);
        const necklineEnd = findNecklinePoint(potentialRightShoulder, priceData);
        
        setPattern({
          leftShoulder: potentialLeftShoulder,
          head: potentialHead,
          rightShoulder: potentialRightShoulder
        });
        
        setNeckline({
          start: necklineStart,
          end: necklineEnd
        });
        
        return;
      }
    }
    
    setPattern(null);
    setNeckline(null);
  };

  const findPeaksAndTroughs = (priceData) => {
    const peaks = [];
    
    for (let i = 1; i < priceData.length - 1; i++) {
      const prev = priceData[i - 1].price;
      const curr = priceData[i].price;
      const next = priceData[i + 1].price;
      
      if (curr > prev && curr > next) {
        peaks.push({
          index: i,
          price: curr,
          type: 'peak'
        });
      }
    }
    
    return peaks;
  };

  const isValidHeadAndShoulders = (leftShoulder, head, rightShoulder, priceData) => {
    // Head should be higher than shoulders
    if (head.price <= leftShoulder.price || head.price <= rightShoulder.price) return false;
    
    // Shoulders should be roughly equal height (within 10%)
    const shoulderDiff = Math.abs(leftShoulder.price - rightShoulder.price);
    if (shoulderDiff / leftShoulder.price > 0.1) return false;
    
    // Check spacing between points
    const leftSpacing = head.index - leftShoulder.index;
    const rightSpacing = rightShoulder.index - head.index;
    if (Math.abs(leftSpacing - rightSpacing) / leftSpacing > 0.3) return false;
    
    return true;
  };

  const findNecklinePoint = (shoulder, priceData) => {
    // Find lowest point between shoulder and head
    let lowestPoint = { price: Infinity };
    
    for (let i = shoulder.index; i < shoulder.index + 5; i++) {
      if (i < priceData.length && priceData[i].price < lowestPoint.price) {
        lowestPoint = {
          index: i,
          price: priceData[i].price
        };
      }
    }
    
    return lowestPoint;
  };

  const calculatePriceTarget = () => {
    if (!pattern || !neckline) return null;
    
    // Height of pattern
    const patternHeight = pattern.head.price - neckline.start.price;
    
    // Price target is neckline minus pattern height
    return neckline.start.price - patternHeight;
  };

  return (
    <Card className="w-full max-w-4xl bg-white">
      <CardHeader>
        <CardTitle>Head & Shoulders Pattern Detector</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <LineChart
            width={800}
            height={400}
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#8884d8" 
              dot={false} 
            />
            
            {pattern && (
              <>
                {/* Mark pattern points */}
                <ReferenceLine
                  x={data[pattern.leftShoulder.index].date}
                  stroke="green"
                  label="LS"
                />
                <ReferenceLine
                  x={data[pattern.head.index].date}
                  stroke="red"
                  label="H"
                />
                <ReferenceLine
                  x={data[pattern.rightShoulder.index].date}
                  stroke="green"
                  label="RS"
                />
                
                {/* Draw neckline */}
                {neckline && (
                  <ReferenceArea
                    x1={data[neckline.start.index].date}
                    x2={data[neckline.end.index].date}
                    y1={neckline.start.price}
                    y2={neckline.end.price}
                    stroke="blue"
                    strokeOpacity={0.3}
                    label="Neckline"
                  />
                )}
              </>
            )}
          </LineChart>
        </div>

        {pattern ? (
          <Alert className="mt-4">
            <AlertDescription>
              Head & Shoulders pattern detected! 
              Price target: ${calculatePriceTarget()?.toFixed(2)}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mt-4">
            <AlertDescription>
              No Head & Shoulders pattern detected in current data
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default HeadAndShouldersDetector;