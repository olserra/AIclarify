import * as vscode from 'vscode';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { APIClient } from './APIClient';
import { TelemetryService } from './TelemetryService';

export interface TestGenerationOptions {
    framework: 'jest' | 'mocha' | 'pytest';
    coverage: 'unit' | 'integration' | 'e2e';
    includeMocks: boolean;
    includeComments: boolean;
}

export interface GeneratedTest {
    name: string;
    code: string;
    type: 'unit' | 'integration' | 'e2e';
    mocks?: Record<string, any>;
    comments?: string[];
}

export class TestGenerationService {
    private static instance: TestGenerationService;
    private context: vscode.ExtensionContext;
    private apiClient: APIClient;
    private telemetryService: TelemetryService;

    private constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.telemetryService = TelemetryService.getInstance(context);
        this.initializeAPIClient();
    }

    private initializeAPIClient(): void {
        const config = vscode.workspace.getConfiguration('cursorai');
        this.apiClient = APIClient.getInstance({
            apiKey: config.get('apiKey') || '',
            analysisLevel: config.get('analysisLevel') || 'basic',
            testFramework: config.get('testFramework') || 'jest'
        });

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

    public static getInstance(context: vscode.ExtensionContext): TestGenerationService {
        if (!TestGenerationService.instance) {
            TestGenerationService.instance = new TestGenerationService(context);
        }
        return TestGenerationService.instance;
    }

    public async generateTests(
        document: TextDocument,
        options: Partial<TestGenerationOptions> = {}
    ): Promise<GeneratedTest[]> {
        const startTime = Date.now();
        try {
            const text = document.getText();
            const languageId = document.languageId;
            const config = vscode.workspace.getConfiguration('cursorai');

            // Merge default options with provided options
            const testOptions: TestGenerationOptions = {
                framework: options.framework || (config.get('testFramework') as 'jest' | 'mocha' | 'pytest') || 'jest',
                coverage: options.coverage || 'unit',
                includeMocks: options.includeMocks ?? true,
                includeComments: options.includeComments ?? true
            };

            const tests = await this.apiClient.generateTests({
                code: text,
                language: languageId,
                framework: testOptions.framework,
                options: testOptions
            });

            // Track test generation
            await this.telemetryService.trackOperation('generateTests', Date.now() - startTime);
            await this.telemetryService.trackEvent({
                eventName: 'testGeneration',
                properties: {
                    framework: testOptions.framework,
                    coverage: testOptions.coverage,
                    testCount: tests.length,
                    hasMocks: testOptions.includeMocks,
                    hasComments: testOptions.includeComments
                }
            });

            return this.transformTests(tests, testOptions);
        } catch (error) {
            await this.telemetryService.trackError(
                error instanceof Error ? error : new Error(String(error)),
                'generateTests'
            );
            throw error;
        }
    }

    public async insertTests(document: TextDocument, tests: GeneratedTest[]): Promise<void> {
        const startTime = Date.now();
        try {
            const edit = new vscode.WorkspaceEdit();
            const testFilePath = this.getTestFilePath(document.uri.fsPath);

            // Create test file if it doesn't exist
            if (!await this.fileExists(testFilePath)) {
                const testFileContent = this.generateTestFileContent(tests);
                edit.createFile(vscode.Uri.file(testFilePath));
                edit.insert(vscode.Uri.file(testFilePath), new vscode.Position(0, 0), testFileContent);
            } else {
                // Append tests to existing file
                const existingContent = await vscode.workspace.fs.readFile(vscode.Uri.file(testFilePath));
                const newContent = this.generateTestFileContent(tests);
                edit.insert(vscode.Uri.file(testFilePath), new vscode.Position(existingContent.length, 0), newContent);
            }

            await vscode.workspace.applyEdit(edit);
            await this.telemetryService.trackOperation('insertTests', Date.now() - startTime);
        } catch (error) {
            await this.telemetryService.trackError(
                error instanceof Error ? error : new Error(String(error)),
                'insertTests'
            );
            throw error;
        }
    }

    private getTestFilePath(sourceFilePath: string): string {
        const dir = sourceFilePath.substring(0, sourceFilePath.lastIndexOf('/'));
        const fileName = sourceFilePath.substring(sourceFilePath.lastIndexOf('/') + 1);
        const testDir = `${dir}/__tests__`;
        return `${testDir}/${fileName.replace(/\.[^/.]+$/, '')}.test.ts`;
    }

    private async fileExists(filePath: string): Promise<boolean> {
        try {
            await vscode.workspace.fs.stat(vscode.Uri.file(filePath));
            return true;
        } catch {
            return false;
        }
    }

    private generateTestFileContent(tests: GeneratedTest[]): string {
        const imports = this.generateTestImports(tests);
        const testContent = tests.map(test => this.formatTest(test)).join('\n\n');
        return `${imports}\n\n${testContent}`;
    }

    private generateTestImports(tests: GeneratedTest[]): string {
        const imports = new Set<string>();

        // Add framework-specific imports
        imports.add("import { describe, it, expect } from '@jest/globals';");

        // Add mock-related imports if needed
        if (tests.some(test => test.mocks)) {
            imports.add("import { jest } from '@jest/globals';");
        }

        return Array.from(imports).join('\n');
    }

    private formatTest(test: GeneratedTest): string {
        const comments = test.comments?.map(comment => `// ${comment}`).join('\n') || '';
        const mocks = test.mocks ? this.formatMocks(test.mocks) : '';

        return `${comments}
describe('${test.name}', () => {
    ${mocks}
    it('should work as expected', () => {
        ${test.code}
    });
});`;
    }

    private formatMocks(mocks: Record<string, any>): string {
        return Object.entries(mocks)
            .map(([key, value]) => `const ${key} = ${JSON.stringify(value)};`)
            .join('\n    ');
    }

    private transformTests(tests: any[], options: TestGenerationOptions): GeneratedTest[] {
        return tests.map(test => ({
            name: test.name || 'Test',
            code: test.code || '',
            type: test.type || 'unit',
            mocks: options.includeMocks ? test.mocks : undefined,
            comments: options.includeComments ? test.comments : undefined
        }));
    }
} 