import * as vscode from 'vscode';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { APIClient, APIConfig } from './APIClient';
import { TelemetryService } from './TelemetryService';

export interface AnalysisResult {
    summary: string;
    suggestions: CodeSuggestion[];
    performance: PerformanceMetrics;
    security: SecurityMetrics;
    maintainability: MaintainabilityMetrics;
}

export interface CodeSuggestion {
    type: 'improvement' | 'bug' | 'security' | 'performance';
    message: string;
    severity: 'low' | 'medium' | 'high';
    line?: number;
    column?: number;
    code?: string;
}

export interface PerformanceMetrics {
    score: number;
    issues: string[];
    recommendations: string[];
}

export interface SecurityMetrics {
    score: number;
    vulnerabilities: string[];
    bestPractices: string[];
}

export interface MaintainabilityMetrics {
    score: number;
    complexity: number;
    issues: string[];
}

export class CodeAnalysisService {
    private static instance: CodeAnalysisService;
    private context: vscode.ExtensionContext;
    private apiClient: APIClient;
    private telemetryService: TelemetryService;
    private realTimeAnalysisEnabled: boolean = false;
    private analysisTimeout: NodeJS.Timeout | undefined;
    private lastAnalysis: AnalysisResult | undefined;

    private constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.telemetryService = TelemetryService.getInstance(context);
        this.initializeAPIClient();
        this.initializeRealTimeAnalysis();
    }

    private initializeAPIClient(): void {
        const config = vscode.workspace.getConfiguration('cursorai');
        const apiConfig: APIConfig = {
            apiKey: config.get('apiKey') || '',
            analysisLevel: config.get('analysisLevel') || 'basic',
            testFramework: config.get('testFramework') || 'jest'
        };
        this.apiClient = APIClient.getInstance(apiConfig);

        // Listen for configuration changes
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('cursorai')) {
                const newConfig = vscode.workspace.getConfiguration('cursorai');
                this.apiClient.updateConfig({
                    apiKey: newConfig.get('apiKey') || '',
                    analysisLevel: newConfig.get('analysisLevel') || 'basic',
                    testFramework: newConfig.get('testFramework') || 'jest'
                });
            }
        });
    }

    private initializeRealTimeAnalysis(): void {
        // Listen for document changes
        vscode.workspace.onDidChangeTextDocument(
            this.handleDocumentChange.bind(this),
            null,
            this.context.subscriptions
        );

        // Listen for configuration changes
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('cursorai.realTimeAnalysis')) {
                this.realTimeAnalysisEnabled = vscode.workspace
                    .getConfiguration('cursorai')
                    .get('realTimeAnalysis') || false;
            }
        });
    }

    private async handleDocumentChange(event: vscode.TextDocumentChangeEvent): Promise<void> {
        if (!this.realTimeAnalysisEnabled) return;

        // Clear existing timeout
        if (this.analysisTimeout) {
            clearTimeout(this.analysisTimeout);
        }

        // Set new timeout for analysis
        this.analysisTimeout = setTimeout(async () => {
            try {
                const result = await this.analyzeDocument(event.document);
                this.lastAnalysis = result;
                this.notifyAnalysisResult(result);
            } catch (error) {
                console.error('Real-time analysis error:', error);
            }
        }, 1000); // Debounce for 1 second
    }

    private notifyAnalysisResult(result: AnalysisResult): void {
        // Emit event for code actions and diagnostics
        vscode.commands.executeCommand('cursorai.onAnalysisResult', result);
    }

    public async startRealTimeAnalysis(): Promise<void> {
        this.realTimeAnalysisEnabled = true;
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            await this.handleDocumentChange({
                document: activeEditor.document,
                contentChanges: []
            });
        }
    }

    public stopRealTimeAnalysis(): void {
        this.realTimeAnalysisEnabled = false;
        if (this.analysisTimeout) {
            clearTimeout(this.analysisTimeout);
            this.analysisTimeout = undefined;
        }
    }

    public getLastAnalysis(): AnalysisResult | undefined {
        return this.lastAnalysis;
    }

    public static getInstance(context: vscode.ExtensionContext): CodeAnalysisService {
        if (!CodeAnalysisService.instance) {
            CodeAnalysisService.instance = new CodeAnalysisService(context);
        }
        return CodeAnalysisService.instance;
    }

    public async analyzeDocument(document: TextDocument): Promise<AnalysisResult> {
        const startTime = Date.now();
        try {
            const text = document.getText();
            const languageId = document.languageId;
            const config = vscode.workspace.getConfiguration('cursorai');

            const result = await this.apiClient.analyzeCode({
                code: text,
                language: languageId,
                analysisLevel: config.get('analysisLevel') || 'basic'
            });

            const analysisResult = this.transformAPIResponse(result);

            // Track analysis completion
            await this.telemetryService.trackOperation('analyzeDocument', Date.now() - startTime);
            await this.telemetryService.trackAnalysis('code', analysisResult);

            return analysisResult;
        } catch (error) {
            await this.telemetryService.trackError(
                error instanceof Error ? error : new Error(String(error)),
                'analyzeDocument'
            );
            throw error;
        }
    }

    public async generateTests(document: TextDocument): Promise<string[]> {
        const startTime = Date.now();
        try {
            const text = document.getText();
            const languageId = document.languageId;
            const config = vscode.workspace.getConfiguration('cursorai');

            const tests = await this.apiClient.generateTests({
                code: text,
                language: languageId,
                framework: config.get('testFramework') || 'jest'
            });

            // Track test generation
            await this.telemetryService.trackOperation('generateTests', Date.now() - startTime);
            await this.telemetryService.trackEvent({
                eventName: 'testGeneration',
                properties: {
                    framework: config.get('testFramework') || 'jest',
                    testCount: tests.length
                }
            });

            return tests;
        } catch (error) {
            await this.telemetryService.trackError(
                error instanceof Error ? error : new Error(String(error)),
                'generateTests'
            );
            throw error;
        }
    }

    public async applyMaintainabilityImprovements(document: TextDocument): Promise<void> {
        const startTime = Date.now();
        try {
            const analysis = await this.analyzeDocument(document);
            const improvements = this.getMaintainabilityImprovements(analysis.maintainability);

            if (improvements.length > 0) {
                const edit = new vscode.WorkspaceEdit();
                for (const improvement of improvements) {
                    if (improvement.range && improvement.newText) {
                        edit.replace(document.uri, improvement.range, improvement.newText);
                    }
                }
                await vscode.workspace.applyEdit(edit);
            }

            await this.telemetryService.trackOperation('applyMaintainabilityImprovements', Date.now() - startTime);
        } catch (error) {
            await this.telemetryService.trackError(
                error instanceof Error ? error : new Error(String(error)),
                'applyMaintainabilityImprovements'
            );
            throw error;
        }
    }

    private getMaintainabilityImprovements(maintainability: MaintainabilityMetrics): Array<{ range: vscode.Range; newText: string }> {
        const improvements: Array<{ range: vscode.Range; newText: string }> = [];

        // Example improvements based on maintainability metrics
        if (maintainability.complexity > 10) {
            // Suggest breaking down complex functions
            improvements.push({
                range: new vscode.Range(0, 0, 0, 0), // This would be replaced with actual range
                newText: '// Consider breaking this function into smaller, more focused functions'
            });
        }

        if (maintainability.issues.includes('High cyclomatic complexity')) {
            improvements.push({
                range: new vscode.Range(0, 0, 0, 0), // This would be replaced with actual range
                newText: '// Consider using early returns to reduce nesting'
            });
        }

        return improvements;
    }

    private transformAPIResponse(response: any): AnalysisResult {
        // Transform the API response into our AnalysisResult format
        return {
            summary: response.summary || 'Code analysis completed',
            suggestions: (response.suggestions || []).map((s: any) => ({
                type: s.type || 'improvement',
                message: s.message || '',
                severity: s.severity || 'medium',
                line: s.line,
                column: s.column,
                code: s.code
            })),
            performance: {
                score: response.performance?.score || 0,
                issues: response.performance?.issues || [],
                recommendations: response.performance?.recommendations || []
            },
            security: {
                score: response.security?.score || 0,
                vulnerabilities: response.security?.vulnerabilities || [],
                bestPractices: response.security?.bestPractices || []
            },
            maintainability: {
                score: response.maintainability?.score || 0,
                complexity: response.maintainability?.complexity || 0,
                issues: response.maintainability?.issues || []
            }
        };
    }
} 