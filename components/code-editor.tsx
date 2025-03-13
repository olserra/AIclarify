'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Play, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AnalysisResult {
  complexity: number;
  maintainability: number;
  coverage: number;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    line: number;
  }>;
}

export function CodeEditor() {
  const [code, setCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      // TODO: Implement actual code analysis API call
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalysisResult({
        complexity: Math.floor(Math.random() * 10) + 10,
        maintainability: Math.floor(Math.random() * 20) + 70,
        coverage: Math.floor(Math.random() * 20) + 70,
        issues: [
          {
            type: 'warning',
            message: 'Consider adding type annotations',
            line: 1
          },
          {
            type: 'info',
            message: 'Function could be simplified',
            line: 5
          }
        ]
      });
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className="min-h-[300px] font-mono"
        />
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setCode('')}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Clear
          </Button>
          <Button onClick={handleAnalyze} disabled={isAnalyzing || !code}>
            <Play className="mr-2 h-4 w-4" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
          </Button>
        </div>
      </Card>

      {analysisResult && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Complexity</p>
              <div className="text-2xl font-bold">{analysisResult.complexity}</div>
              <Progress value={analysisResult.complexity * 10} className="mt-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Maintainability</p>
              <div className="text-2xl font-bold">{analysisResult.maintainability}%</div>
              <Progress value={analysisResult.maintainability} className="mt-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Coverage</p>
              <div className="text-2xl font-bold">{analysisResult.coverage}%</div>
              <Progress value={analysisResult.coverage} className="mt-2" />
            </div>
          </div>
          {analysisResult.issues.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Issues Found</h4>
              <div className="space-y-2">
                {analysisResult.issues.map((issue, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-md text-sm ${issue.type === 'error'
                        ? 'bg-destructive/10 text-destructive'
                        : issue.type === 'warning'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-blue-500/10 text-blue-500'
                      }`}
                  >
                    <span className="font-medium">Line {issue.line}:</span> {issue.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}