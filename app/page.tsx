import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/code-editor';
import { Card } from '@/components/ui/card';
import { Brain, Code2, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span className="text-lg font-bold">CursorAI Analysis</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline">Sign In</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </nav>

      <div className="container px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              AI-Powered Code Analysis
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Submit your code for instant AI analysis, debugging insights, and best practices recommendations.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Card className="p-6">
                <Code2 className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-semibold">Code Explanation</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Get detailed explanations of code functionality and architecture.
                </p>
              </Card>
              <Card className="p-6">
                <Zap className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-semibold">Performance Insights</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Identify bottlenecks and optimize your code for better performance.
                </p>
              </Card>
            </div>
          </div>
          <div>
            <CodeEditor />
          </div>
        </div>
      </div>
    </main>
  );
}