import Link from "next/link"
import { Github, Twitter } from "lucide-react"

export function SiteFooter() {
    return (
        <footer className="border-t py-6 md:py-0">
            <div className="container mx-auto max-w-[1400px] flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by{" "}
                        <a
                            href="https://github.com/olserra"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            AIclarify
                        </a>
                        . The source code is available on{" "}
                        <a
                            href="https://github.com/olserra/aiclarify"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            GitHub
                        </a>
                        .
                    </p>
                    <div className="flex items-center space-x-1">
                        <Link
                            href="https://github.com/olserra/aiclarify"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-1 w-9 px-0"
                        >
                            <Github className="h-4 w-4" />
                            <span className="sr-only">GitHub</span>
                        </Link>
                        <Link
                            href="https://twitter.com/olserra"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-1 w-9 px-0"
                        >
                            <Twitter className="h-4 w-4" />
                            <span className="sr-only">Twitter</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
} 