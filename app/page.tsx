'use client'

import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Code2, FileCode, GitBranch, Zap, RefreshCw } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const analysisData = [
  { name: "Jan", complexity: 15, maintainability: 85, coverage: 92, issues: 8 },
  { name: "Feb", complexity: 18, maintainability: 82, coverage: 90, issues: 12 },
  { name: "Mar", complexity: 12, maintainability: 88, coverage: 95, issues: 5 },
  { name: "Apr", complexity: 20, maintainability: 78, coverage: 88, issues: 15 },
  { name: "May", complexity: 16, maintainability: 84, coverage: 91, issues: 9 },
  { name: "Jun", complexity: 14, maintainability: 86, coverage: 93, issues: 7 },
]

const codeInsights = [
  {
    title: "High Complexity Areas",
    description: "3 functions with cyclomatic complexity > 15",
    files: ["src/components/DataProcessor.ts", "src/utils/transformers.ts"],
    recommendation: "Consider breaking down complex functions into smaller, more manageable pieces",
    priority: "high"
  },
  {
    title: "Code Duplication",
    description: "12% of codebase contains duplicated logic",
    files: ["src/services/*"],
    recommendation: "Extract common patterns into shared utilities or hooks",
    priority: "medium"
  },
  {
    title: "Missing Tests",
    description: "5 critical components lack test coverage",
    files: ["src/components/Chart.tsx", "src/hooks/useData.ts"],
    recommendation: "Add unit tests for uncovered components, focusing on edge cases",
    priority: "high"
  }
]

export default function Home() {
  const handleRefresh = async () => {
    try {
      // Check if we're in VSCode environment
      if (typeof window !== 'undefined' && (window as any).vscode) {
        // Trigger the VSCode extension's analyze command
        (window as any).vscode.postMessage({
          command: 'cursorai.analyze'
        });
      } else {
        // If not in VSCode, show a message that this feature is only available in the IDE
        console.log('This feature is only available in the VSCode extension');
      }
    } catch (error) {
      console.error('Failed to refresh analysis:', error);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">
        <div className="container mx-auto max-w-[1400px]">
          <main className="flex w-full flex-1 flex-col overflow-hidden">
            <div className="flex-1 space-y-4 p-8 pt-6">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Code Analysis Dashboard</h2>
                <Button onClick={handleRefresh}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Code Complexity
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">15.8</div>
                    <p className="text-xs text-muted-foreground">
                      Average cyclomatic complexity
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Maintainability
                    </CardTitle>
                    <FileCode className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">84%</div>
                    <Progress value={84} className="mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Code Coverage
                    </CardTitle>
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">92%</div>
                    <p className="text-xs text-muted-foreground">
                      Test coverage rate
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Open Issues
                    </CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">7</div>
                    <p className="text-xs text-muted-foreground">
                      Critical issues to address
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Code Quality Trends</CardTitle>
                  <CardDescription>
                    Complexity, maintainability, and issues over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analysisData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="complexity"
                          stroke="#8884d8"
                          name="Complexity"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="maintainability"
                          stroke="#82ca9d"
                          name="Maintainability"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="issues"
                          stroke="#ff7300"
                          name="Issues"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Code Insights & Recommendations</CardTitle>
                  <CardDescription>
                    Key findings and suggested improvements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {codeInsights.map((insight, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`rounded-full p-2 ${insight.priority === 'high' ? 'bg-red-100 dark:bg-red-900' : 'bg-yellow-100 dark:bg-yellow-900'
                          }`}>
                          <Zap className={`h-4 w-4 ${insight.priority === 'high' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
                            }`} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="text-sm font-medium">{insight.title}</h4>
                          <p className="text-sm text-muted-foreground">{insight.description}</p>
                          <div className="flex items-center space-x-2">
                            <FileCode className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{insight.files.join(', ')}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Recommendation:</span> {insight.recommendation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}