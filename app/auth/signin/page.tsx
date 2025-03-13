'use client'

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/layout/site-header"

export default function SignInPage() {
    return (
        <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">
                <div className="container relative flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center">
                    <Card className="w-full max-w-[400px]">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
                            <CardDescription className="text-center">
                                Sign in to your account to continue
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                className="w-full"
                                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                            >
                                Sign in with Google
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
} 