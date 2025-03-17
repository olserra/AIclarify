import * as vscode from 'vscode';
import axios from 'axios';

export interface TelemetryEvent {
    eventName: string;
    properties?: Record<string, any>;
    measurements?: Record<string, number>;
}

export class TelemetryService {
    private static instance: TelemetryService;
    private context: vscode.ExtensionContext;
    private enabled: boolean = true;
    private endpoint: string = 'https://api.cursorai.com/v1/telemetry';
    private queue: TelemetryEvent[] = [];
    private flushInterval: NodeJS.Timeout;

    private constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.initializeTelemetry();
    }

    private initializeTelemetry(): void {
        // Load telemetry settings
        const config = vscode.workspace.getConfiguration('cursorai');
        this.enabled = config.get('telemetry.enabled') ?? true;

        // Set up periodic flush
        this.flushInterval = setInterval(() => this.flush(), 60000); // Flush every minute

        // Listen for configuration changes
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('cursorai.telemetry')) {
                this.enabled = vscode.workspace
                    .getConfiguration('cursorai')
                    .get('telemetry.enabled') ?? true;
            }
        });
    }

    public static getInstance(context: vscode.ExtensionContext): TelemetryService {
        if (!TelemetryService.instance) {
            TelemetryService.instance = new TelemetryService(context);
        }
        return TelemetryService.instance;
    }

    public async trackEvent(event: TelemetryEvent): Promise<void> {
        if (!this.enabled) return;

        this.queue.push({
            ...event,
            properties: {
                ...event.properties,
                extensionVersion: this.context.extension.packageJSON.version,
                vscodeVersion: vscode.version,
                language: vscode.window.activeTextEditor?.document.languageId
            }
        });

        // Flush if queue is getting large
        if (this.queue.length >= 10) {
            await this.flush();
        }
    }

    public async trackOperation(operation: string, duration: number): Promise<void> {
        await this.trackEvent({
            eventName: 'operation',
            properties: { operation },
            measurements: { duration }
        });
    }

    public async trackError(error: Error, context: string): Promise<void> {
        await this.trackEvent({
            eventName: 'error',
            properties: {
                errorMessage: error.message,
                errorStack: error.stack,
                context
            }
        });
    }

    public async trackAnalysis(analysisType: string, result: any): Promise<void> {
        await this.trackEvent({
            eventName: 'analysis',
            properties: {
                type: analysisType,
                hasSuggestions: result.suggestions?.length > 0,
                performanceScore: result.performance?.score,
                securityScore: result.security?.score,
                maintainabilityScore: result.maintainability?.score
            }
        });
    }

    private async flush(): Promise<void> {
        if (this.queue.length === 0) return;

        const events = [...this.queue];
        this.queue = [];

        try {
            await axios.post(this.endpoint, {
                events,
                sessionId: this.context.extension.id,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Failed to send telemetry:', error);
            // Put events back in queue for retry
            this.queue = [...events, ...this.queue];
        }
    }

    public dispose(): void {
        clearInterval(this.flushInterval);
        this.flush();
    }
} 