'use client'

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/layout/site-header"
import { signIn } from "next-auth/react"

export default function AuthErrorPage() {
    const searchParams = useSearchParams()
    const error = searchParams.get("error")

    return (
        <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">
                <div className="container relative flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center">
                    <Card className="w-full max-w-[400px]">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center">Authentication Error</CardTitle>
                            <CardDescription className="text-center">
                                {error === "AccessDenied"
                                    ? "You do not have permission to sign in."
                                    : "An error occurred during authentication."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                className="w-full"
                                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                            >
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
} 