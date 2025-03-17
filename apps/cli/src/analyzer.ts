import * as fs from 'fs';
import * as path from 'path';
import { APIClient } from '../../vscode-extension/src/services/APIClient';

interface AnalysisResult {
    file: string;
    issues: any[];
    performance: any;
    security: any;
    maintainability: any;
    suggestions: any[];
}

export async function analyzeProject(files: string[]): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];
    const apiClient = APIClient.getInstance({
        apiKey: process.env.AICLARIFY_API_KEY || '',
        analysisLevel: 'comprehensive',
        testFramework: 'jest'
    });

    for (const file of files) {
        try {
            const content = fs.readFileSync(file, 'utf-8');
            const relativePath = path.relative(process.cwd(), file);
            const languageId = getLanguageId(file);

            const analysis = await apiClient.analyzeCode({
                code: content,
                language: languageId,
                options: {
                    includePerformance: true,
                    includeSecurity: true,
                    includeMaintainability: true
                }
            });

            results.push({
                file: relativePath,
                issues: analysis.issues || [],
                performance: analysis.performance || {},
                security: analysis.security || {},
                maintainability: analysis.maintainability || {},
                suggestions: analysis.suggestions || []
            });
        } catch (error) {
            console.error(`Error analyzing ${file}:`, error);
        }
    }

    return results;
}

function getLanguageId(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.js':
            return 'javascript';
        case '.ts':
            return 'typescript';
        case '.py':
            return 'python';
        default:
            return 'plaintext';
    }
} 