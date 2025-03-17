import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';
import { CodeAnalysisService } from './services/CodeAnalysisService';
import { UIService } from './services/UIService';
import { CodeActionProvider } from './providers/CodeActionProvider';
import { TestGenerationService } from './services/TestGenerationService';

let client: LanguageClient;

export async function activate(context: vscode.ExtensionContext) {
  // Initialize services
  const uiService = UIService.getInstance(context);
  const analysisService = CodeAnalysisService.getInstance(context);
  const testGenerationService = TestGenerationService.getInstance(context);

  // Server options - running the language server
  const serverModule = context.asAbsolutePath('dist/server.js');
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
  };

  // Client options
  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: 'file', language: 'javascript' },
      { scheme: 'file', language: 'typescript' },
      { scheme: 'file', language: 'python' }
    ]
  };

  // Create and start the client
  client = new LanguageClient(
    'cursoraiAnalysis',
    'AIclarify',
    serverOptions,
    clientOptions
  );

  // Register code action provider
  const codeActionProvider = new CodeActionProvider(analysisService);
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { scheme: 'file' },
      codeActionProvider
    )
  );

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('cursorai.analyze', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        uiService.showInfo('No active editor');
        return;
      }

      try {
        uiService.showProgress('Analyzing code...');
        const result = await analysisService.analyzeDocument(editor.document);
        uiService.showAnalysisResults(result);
        uiService.hideProgress();
        uiService.showInfo('Analysis completed successfully');
      } catch (error) {
        uiService.hideProgress();
        uiService.showError('Analysis failed: ' + error);
      }
    }),

    vscode.commands.registerCommand('cursorai.generateTests', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        uiService.showInfo('No active editor');
        return;
      }

      try {
        uiService.showProgress('Generating tests...');
        const tests = await testGenerationService.generateTests(editor.document);
        await testGenerationService.insertTests(editor.document, tests);
        uiService.showTestResults(tests);
        uiService.hideProgress();
        uiService.showInfo('Tests generated successfully');
      } catch (error) {
        uiService.hideProgress();
        uiService.showError('Test generation failed: ' + error);
      }
    }),

    vscode.commands.registerCommand('cursorai.toggleRealTimeAnalysis', async () => {
      const config = vscode.workspace.getConfiguration('cursorai');
      const isEnabled = config.get('realTimeAnalysis') || false;

      await config.update('realTimeAnalysis', !isEnabled, true);

      if (!isEnabled) {
        await analysisService.startRealTimeAnalysis();
        uiService.showInfo('Real-time analysis enabled');
      } else {
        analysisService.stopRealTimeAnalysis();
        uiService.showInfo('Real-time analysis disabled');
      }
    }),

    vscode.commands.registerCommand('cursorai.applyPerformanceImprovements', async (recommendations: string[]) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        uiService.showInfo('No active editor');
        return;
      }

      try {
        uiService.showProgress('Applying performance improvements...');
        await analysisService.applyPerformanceImprovements(editor.document);
        uiService.hideProgress();
        uiService.showInfo('Performance improvements applied');
      } catch (error) {
        uiService.hideProgress();
        uiService.showError('Failed to apply performance improvements: ' + error);
      }
    }),

    vscode.commands.registerCommand('cursorai.applySecurityBestPractices', async (bestPractices: string[]) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        uiService.showInfo('No active editor');
        return;
      }

      try {
        uiService.showProgress('Applying security best practices...');
        await analysisService.applySecurityBestPractices(editor.document);
        uiService.hideProgress();
        uiService.showInfo('Security best practices applied');
      } catch (error) {
        uiService.hideProgress();
        uiService.showError('Failed to apply security best practices: ' + error);
      }
    }),

    vscode.commands.registerCommand('cursorai.applyMaintainabilityImprovements', async (issues: string[]) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        uiService.showInfo('No active editor');
        return;
      }

      try {
        uiService.showProgress('Applying maintainability improvements...');
        await analysisService.applyMaintainabilityImprovements(editor.document);
        uiService.hideProgress();
        uiService.showInfo('Maintainability improvements applied');
      } catch (error) {
        uiService.hideProgress();
        uiService.showError('Failed to apply maintainability improvements: ' + error);
      }
    })
  );

  // Start the client
  await client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

function getWebviewContent(result: any): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AIclarify</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 1rem; }
        .result { background: #f5f5f5; padding: 1rem; border-radius: 4px; }
      </style>
    </head>
    <body>
      <h2>Analysis Results</h2>
      <div class="result">
        <pre>${JSON.stringify(result, null, 2)}</pre>
      </div>
    </body>
    </html>
  `;
}