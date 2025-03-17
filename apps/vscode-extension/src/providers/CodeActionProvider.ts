import * as vscode from 'vscode';
import { CodeAnalysisService, CodeSuggestion } from '../services/CodeAnalysisService';

export class AIclarifyCodeActionProvider implements vscode.CodeActionProvider {
    private analysisService: CodeAnalysisService;

    constructor(analysisService: CodeAnalysisService) {
        this.analysisService = analysisService;
    }

    public async provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): Promise<vscode.CodeAction[]> {
        const actions: vscode.CodeAction[] = [];

        try {
            const result = await this.analysisService.analyzeDocument(document);

            // Filter suggestions for the current range
            const relevantSuggestions = result.suggestions.filter(suggestion => {
                if (!suggestion.line) return false;
                const line = document.lineAt(suggestion.line - 1);
                return line.range.intersection(range);
            });

            // Create code actions for each suggestion
            for (const suggestion of relevantSuggestions) {
                const action = this.createCodeAction(suggestion, document);
                if (action) {
                    actions.push(action);
                }
            }

            // Add performance improvements
            if (result.performance.recommendations.length > 0) {
                const performanceAction = this.createPerformanceAction(result.performance, document);
                if (performanceAction) {
                    actions.push(performanceAction);
                }
            }

            // Add security improvements
            if (result.security.bestPractices.length > 0) {
                const securityAction = this.createSecurityAction(result.security, document);
                if (securityAction) {
                    actions.push(securityAction);
                }
            }

            // Add maintainability improvements
            if (result.maintainability.issues.length > 0) {
                const maintainabilityAction = this.createMaintainabilityAction(result.maintainability, document);
                if (maintainabilityAction) {
                    actions.push(maintainabilityAction);
                }
            }
        } catch (error) {
            console.error('Error providing code actions:', error);
        }

        return actions;
    }

    private createCodeAction(suggestion: CodeSuggestion, document: vscode.TextDocument): vscode.CodeAction | undefined {
        const action = new vscode.CodeAction(
            `AIclarify: ${suggestion.message}`,
            this.getCodeActionKind(suggestion.type)
        );

        if (suggestion.code) {
            action.edit = new vscode.WorkspaceEdit();
            const line = document.lineAt(suggestion.line! - 1);
            action.edit.replace(document.uri, line.range, suggestion.code);
        }

        action.diagnostics = [this.createDiagnostic(suggestion, document)];
        return action;
    }

    private createPerformanceAction(performance: any, document: vscode.TextDocument): vscode.CodeAction {
        const action = new vscode.CodeAction(
            'AIclarify: Apply Performance Improvements',
            vscode.CodeActionKind.Refactor
        );

        action.command = {
            command: 'cursorai.applyPerformanceImprovements',
            title: 'Apply Performance Improvements',
            arguments: [performance.recommendations]
        };

        return action;
    }

    private createSecurityAction(security: any, document: vscode.TextDocument): vscode.CodeAction {
        const action = new vscode.CodeAction(
            'AIclarify: Apply Security Best Practices',
            vscode.CodeActionKind.Refactor
        );

        action.command = {
            command: 'cursorai.applySecurityBestPractices',
            title: 'Apply Security Best Practices',
            arguments: [security.bestPractices]
        };

        return action;
    }

    private createMaintainabilityAction(maintainability: any, document: vscode.TextDocument): vscode.CodeAction {
        const action = new vscode.CodeAction(
            'AIclarify: Apply Maintainability Improvements',
            vscode.CodeActionKind.Refactor
        );

        action.command = {
            command: 'cursorai.applyMaintainabilityImprovements',
            title: 'Apply Maintainability Improvements',
            arguments: [maintainability.issues]
        };

        // Add diagnostic for maintainability issues
        const diagnostic = new vscode.Diagnostic(
            new vscode.Range(0, 0, document.lineCount, 0),
            `Maintainability Score: ${maintainability.score}/100\nIssues: ${maintainability.issues.join(', ')}`,
            vscode.DiagnosticSeverity.Warning
        );
        diagnostic.source = 'AIclarify';
        diagnostic.code = 'maintainability';
        action.diagnostics = [diagnostic];

        return action;
    }

    private getCodeActionKind(type: string): vscode.CodeActionKind {
        switch (type) {
            case 'bug':
                return vscode.CodeActionKind.QuickFix;
            case 'security':
                return vscode.CodeActionKind.Refactor;
            case 'performance':
                return vscode.CodeActionKind.Refactor;
            default:
                return vscode.CodeActionKind.QuickFix;
        }
    }

    private createDiagnostic(suggestion: CodeSuggestion, document: vscode.TextDocument): vscode.Diagnostic {
        const line = document.lineAt(suggestion.line! - 1);
        const range = new vscode.Range(
            line.range.start,
            line.range.end
        );

        const diagnostic = new vscode.Diagnostic(
            range,
            suggestion.message,
            this.getDiagnosticSeverity(suggestion.severity)
        );

        diagnostic.source = 'AIclarify';
        diagnostic.code = suggestion.type;
        return diagnostic;
    }

    private getDiagnosticSeverity(severity: string): vscode.DiagnosticSeverity {
        switch (severity) {
            case 'high':
                return vscode.DiagnosticSeverity.Error;
            case 'medium':
                return vscode.DiagnosticSeverity.Warning;
            case 'low':
                return vscode.DiagnosticSeverity.Information;
            default:
                return vscode.DiagnosticSeverity.Warning;
        }
    }
} 