import * as vscode from 'vscode';

export class UIService {
  private static instance: UIService;
  private context: vscode.ExtensionContext;
  private statusBarItem: vscode.StatusBarItem;
  private outputChannel: vscode.OutputChannel;

  private constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.initializeUI();
  }

  private initializeUI(): void {
    // Create status bar item
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.statusBarItem.text = "$(light-bulb) AIclarify";
    this.statusBarItem.tooltip = "AIclarify - Code Analysis & Testing";
    this.statusBarItem.command = 'cursorai.analyze';
    this.statusBarItem.show();

    // Create output channel
    this.outputChannel = vscode.window.createOutputChannel('AIclarify');
    this.outputChannel.show(true);
  }

  public static getInstance(context: vscode.ExtensionContext): UIService {
    if (!UIService.instance) {
      UIService.instance = new UIService(context);
    }
    return UIService.instance;
  }

  public showAnalysisResults(result: any): void {
    this.outputChannel.appendLine('Analysis Results:');
    this.outputChannel.appendLine(JSON.stringify(result, null, 2));
    this.outputChannel.show(true);
  }

  public showTestResults(tests: any[]): void {
    this.outputChannel.appendLine('Generated Tests:');
    this.outputChannel.appendLine(JSON.stringify(tests, null, 2));
    this.outputChannel.show(true);
  }

  public showProgress(message: string): void {
    this.statusBarItem.text = `$(sync~spin) AIclarify: ${message}`;
  }

  public hideProgress(): void {
    this.statusBarItem.text = "$(light-bulb) AIclarify";
  }

  public showError(message: string): void {
    vscode.window.showErrorMessage(`AIclarify: ${message}`);
    this.outputChannel.appendLine(`Error: ${message}`);
    this.outputChannel.show(true);
  }

  public showInfo(message: string): void {
    vscode.window.showInformationMessage(`AIclarify: ${message}`);
    this.outputChannel.appendLine(`Info: ${message}`);
  }

  public dispose(): void {
    this.statusBarItem.dispose();
    this.outputChannel.dispose();
  }
} 