import {
    createConnection,
    TextDocuments,
    ProposedFeatures,
    InitializeParams,
    TextDocumentSyncKind,
    InitializeResult,
    Diagnostic,
    DiagnosticSeverity,
    TextDocumentChangeEvent
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

// Create a connection for the server
const connection = createConnection(ProposedFeatures.all);

// Create a text document manager
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

// Initialize the server
connection.onInitialize((params: InitializeParams) => {
    const result: InitializeResult = {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Incremental,
            // Tell the client that this server supports code completion
            completionProvider: {
                resolveProvider: true
            },
            // Tell the client that this server supports code actions
            codeActionProvider: true,
            // Tell the client that this server supports diagnostics
            diagnosticProvider: {
                interFileDependencies: true,
                workspaceDiagnostics: true
            }
        }
    };

    return result;
});

// Handle document changes
documents.onDidChangeContent((change: TextDocumentChangeEvent<TextDocument>) => {
    validateTextDocument(change.document);
});

// Validate the document
async function validateTextDocument(textDocument: TextDocument): Promise<void> {
    const diagnostics: Diagnostic[] = [];
    const text = textDocument.getText();

    // Basic syntax validation
    try {
        // For JavaScript/TypeScript
        if (textDocument.languageId === 'javascript' || textDocument.languageId === 'typescript') {
            // Check for common issues
            const lines = text.split('\n');
            lines.forEach((line, index) => {
                // Check for console.log statements
                if (line.includes('console.log')) {
                    diagnostics.push({
                        severity: DiagnosticSeverity.Warning,
                        range: {
                            start: { line: index, character: 0 },
                            end: { line: index, character: line.length }
                        },
                        message: 'Consider removing console.log statements in production code',
                        source: 'AIclarify'
                    });
                }

                // Check for TODO comments
                if (line.includes('TODO')) {
                    diagnostics.push({
                        severity: DiagnosticSeverity.Information,
                        range: {
                            start: { line: index, character: 0 },
                            end: { line: index, character: line.length }
                        },
                        message: 'TODO comment found',
                        source: 'AIclarify'
                    });
                }
            });
        }
        // For Python
        else if (textDocument.languageId === 'python') {
            // Check for common Python issues
            const lines = text.split('\n');
            lines.forEach((line, index) => {
                // Check for print statements
                if (line.includes('print(')) {
                    diagnostics.push({
                        severity: DiagnosticSeverity.Warning,
                        range: {
                            start: { line: index, character: 0 },
                            end: { line: index, character: line.length }
                        },
                        message: 'Consider using logging instead of print statements',
                        source: 'AIclarify'
                    });
                }

                // Check for TODO comments
                if (line.includes('TODO')) {
                    diagnostics.push({
                        severity: DiagnosticSeverity.Information,
                        range: {
                            start: { line: index, character: 0 },
                            end: { line: index, character: line.length }
                        },
                        message: 'TODO comment found',
                        source: 'AIclarify'
                    });
                }
            });
        }
    } catch (error) {
        console.error('Error validating document:', error);
    }

    // Send the computed diagnostics to VSCode
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen(); 