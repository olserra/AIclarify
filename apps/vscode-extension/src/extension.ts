import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
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
    'CursorAI Analysis',
    serverOptions,
    clientOptions
  );

  // Register commands
  let analyzeCommand = vscode.commands.registerCommand('cursorai.analyze', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }

    const document = editor.document;
    const selection = editor.selection;
    const text = document.getText(selection) || document.getText();

    try {
      // Send to language server for analysis
      const result = await client.sendRequest('cursorai/analyze', {
        text,
        languageId: document.languageId,
        uri: document.uri.toString()
      });

      // Show results in a webview
      const panel = vscode.window.createWebviewPanel(
        'cursoraiAnalysis',
        'CursorAI Analysis',
        vscode.ViewColumn.Beside,
        { enableScripts: true }
      );

      panel.webview.html = getWebviewContent(result);
    } catch (error) {
      vscode.window.showErrorMessage('Failed to analyze code: ' + error);
    }
  });

  context.subscriptions.push(analyzeCommand);
  client.start();
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
      <title>CursorAI Analysis</title>
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