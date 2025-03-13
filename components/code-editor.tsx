'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Play } from 'lucide-react';

export function CodeEditor() {
  const [code, setCode] = useState('');

  const handleAnalyze = async () => {
    // TODO: Implement code analysis
    console.log('Analyzing code:', code);
  };

  return (
    <Card className="p-4">
      <Textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here..."
        className="min-h-[300px] font-mono"
      />
      <div className="mt-4 flex justify-end">
        <Button onClick={handleAnalyze}>
          <Play className="mr-2 h-4 w-4" />
          Analyze Code
        </Button>
      </div>
    </Card>
  );
}