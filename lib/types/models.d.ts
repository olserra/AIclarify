// Analysis Types
export interface AnalysisResult {
    success: boolean;
    data?: any;
    error?: string;
}

export interface AnalysisOptions {
    language?: string;
    framework?: string;
    dependencies?: string[];
    config?: Record<string, any>;
}

export interface CodeAnalysis {
    language: string;
    framework?: string;
    dependencies: string[];
    issues: string[];
    suggestions: string[];
    metrics: {
        complexity: number;
        maintainability: number;
        testability: number;
    };
}

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    status: number;
}

// User Types
export interface User {
    id: string;
    email: string;
    name?: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

// Project Types
export interface Project {
    id: string;
    name: string;
    description?: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    settings: ProjectSettings;
}

export interface ProjectSettings {
    language: string;
    framework?: string;
    dependencies: string[];
    config: Record<string, any>;
} 