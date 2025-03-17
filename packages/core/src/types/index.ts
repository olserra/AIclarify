export type AnalysisResult = {
    score: number;
    issues: Issue[];
    metrics: Metrics;
    suggestions: string[];
};

export type Issue = {
    type: 'error' | 'warning' | 'info';
    message: string;
    file: string;
    line?: number;
    column?: number;
    rule?: string;
};

export type Metrics = {
    complexity: number;
    maintainability: number;
    reliability: number;
    security: number;
    performance: number;
};

export type AnalysisOptions = {
    includePatterns?: string[];
    excludePatterns?: string[];
    maxDepth?: number;
    timeout?: number;
};

export type ProjectInfo = {
    name: string;
    version: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    scripts: Record<string, string>;
}; 