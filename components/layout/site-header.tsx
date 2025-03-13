'use client';

import Link from "next/link"
import { MainNav } from "./main-nav"
import { ModeToggle } from "../mode-toggle"
import { UserNav } from "./user-nav"
import { Code2 } from "lucide-react"

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto max-w-[1400px] flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Code2 className="h-5 w-5" />
                        <span className="hidden font-bold sm:inline-block">
                            AIclarify
                        </span>
                    </Link>
                </div>
                <MainNav />
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search will go here */}
                    </div>
                    <nav className="flex items-center space-x-2">
                        <ModeToggle />
                        <UserNav />
                    </nav>
                </div>
            </div>
        </header>
    )
} 