'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Code2, Key, BarChart3, Settings } from "lucide-react"

const items = [
    {
        title: "Code Analysis",
        href: "/",
        icon: Code2,
    },
    {
        title: "API Keys",
        href: "/api-keys",
        icon: Key,
    },
    {
        title: "Usage",
        href: "/usage",
        icon: BarChart3,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
]

export function MainNav() {
    const pathname = usePathname()

    return (
        <nav className="flex items-center space-x-4 lg:space-x-6">
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center text-sm font-medium transition-colors hover:text-primary",
                        pathname === item.href
                            ? "text-primary"
                            : "text-muted-foreground"
                    )}
                >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                </Link>
            ))}
        </nav>
    )
} 