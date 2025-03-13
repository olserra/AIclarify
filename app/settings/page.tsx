'use client'

import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"

export default function SettingsPage() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">
                <div className="container mx-auto max-w-[1400px]">
                    <main className="flex w-full flex-1 flex-col overflow-hidden">
                        <div className="flex-1 space-y-4 p-8 pt-6">
                            <div className="flex items-center justify-between space-y-2">
                                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                                <Button>Save Changes</Button>
                            </div>
                            <Tabs defaultValue="account" className="space-y-4">
                                <TabsList>
                                    <TabsTrigger value="account">Account</TabsTrigger>
                                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                                </TabsList>
                                <TabsContent value="account" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Account Settings</CardTitle>
                                            <CardDescription>
                                                Manage your account information
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">Name</Label>
                                                    <Input id="name" placeholder="Enter your name" />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input id="email" type="email" placeholder="Enter your email" />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="password">Password</Label>
                                                    <Input id="password" type="password" placeholder="Enter your password" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="preferences" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Preferences</CardTitle>
                                            <CardDescription>
                                                Customize your experience
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Dark Mode</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Toggle dark mode theme
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={theme === "dark"}
                                                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Email Notifications</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Receive email notifications
                                                    </p>
                                                </div>
                                                <Switch />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="notifications" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Notification Settings</CardTitle>
                                            <CardDescription>
                                                Configure how you receive notifications
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Push Notifications</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Receive push notifications
                                                    </p>
                                                </div>
                                                <Switch />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Marketing Emails</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Receive marketing emails
                                                    </p>
                                                </div>
                                                <Switch />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
} 