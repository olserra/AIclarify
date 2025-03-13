'use client'

import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, CreditCard, Zap } from "lucide-react"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
    { name: "Jan", usage: 400 },
    { name: "Feb", usage: 300 },
    { name: "Mar", usage: 600 },
    { name: "Apr", usage: 800 },
    { name: "May", usage: 700 },
    { name: "Jun", usage: 900 },
]

const chartConfig = {
    usage: {
        label: "API Calls",
        color: "#8884d8"
    }
}

export default function UsagePage() {
    return (
        <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">
                <div className="container mx-auto max-w-[1400px]">
                    <main className="flex w-full flex-1 flex-col overflow-hidden">
                        <div className="flex-1 space-y-4 p-8 pt-6">
                            <div className="flex items-center justify-between space-y-2">
                                <h2 className="text-3xl font-bold tracking-tight">Usage Dashboard</h2>
                                <Button>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Manage Subscription
                                </Button>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Total API Calls
                                        </CardTitle>
                                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">1,234</div>
                                        <p className="text-xs text-muted-foreground">
                                            +20.1% from last month
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Remaining Quota
                                        </CardTitle>
                                        <Zap className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">766</div>
                                        <Progress value={76.6} className="mt-2" />
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Current Plan
                                        </CardTitle>
                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">Pro</div>
                                        <p className="text-xs text-muted-foreground">
                                            $30/month
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Usage History</CardTitle>
                                    <CardDescription>
                                        API calls over time
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ChartContainer config={chartConfig}>
                                            <LineChart data={data}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Line
                                                    type="monotone"
                                                    dataKey="usage"
                                                    stroke={chartConfig.usage.color}
                                                    activeDot={{ r: 8 }}
                                                />
                                            </LineChart>
                                        </ChartContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
} 