import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Copy } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function ApiKeysPage() {
    return (
        <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">
                <div className="container mx-auto max-w-[1400px]">
                    <main className="flex w-full flex-1 flex-col overflow-hidden">
                        <div className="flex-1 space-y-4 p-8 pt-6">
                            <div className="flex items-center justify-between space-y-2">
                                <h2 className="text-3xl font-bold tracking-tight">API Keys</h2>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    New API Key
                                </Button>
                            </div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Create New API Key</CardTitle>
                                    <CardDescription>
                                        Generate a new API key for external integrations
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Key Name</Label>
                                            <Input id="name" placeholder="Enter key name" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="scope">Scope</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select scope" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="read">Read Only</SelectItem>
                                                    <SelectItem value="write">Read & Write</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button>Generate Key</Button>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Active API Keys</CardTitle>
                                    <CardDescription>
                                        View and manage your active API keys
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Scope</TableHead>
                                                <TableHead>Created</TableHead>
                                                <TableHead>Last Used</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Production Key</TableCell>
                                                <TableCell>Read & Write</TableCell>
                                                <TableCell>2024-03-13</TableCell>
                                                <TableCell>2024-03-13</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon">
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
} 