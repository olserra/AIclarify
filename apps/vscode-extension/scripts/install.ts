import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';
import * as os from 'os';

const ROOT_DIR = join(__dirname, '..');
const VSCODE_EXTENSIONS_DIR = join(os.homedir(), '.vscode', 'extensions');

async function install() {
    console.log('🚀 Starting installation process...');

    // Build the extension first
    console.log('📦 Building extension...');
    execSync('npm run build', { stdio: 'inherit' });

    // Create VSCode extensions directory if it doesn't exist
    if (!existsSync(VSCODE_EXTENSIONS_DIR)) {
        console.log('📁 Creating VSCode extensions directory...');
        mkdirSync(VSCODE_EXTENSIONS_DIR, { recursive: true });
    }

    // Create extension directory
    const extensionDir = join(VSCODE_EXTENSIONS_DIR, 'cursorai-analysis-vscode');
    if (!existsSync(extensionDir)) {
        console.log('📁 Creating extension directory...');
        mkdirSync(extensionDir, { recursive: true });
    }

    // Copy package files
    console.log('📋 Copying extension files...');
    const packageDir = join(ROOT_DIR, 'package');
    execSync(`cp -r ${packageDir}/* ${extensionDir}/`, { stdio: 'inherit' });

    // Create workspace settings
    console.log('⚙️ Creating workspace settings...');
    const workspaceDir = join(ROOT_DIR, '..', '..', 'xmem');
    if (!existsSync(workspaceDir)) {
        console.error('❌ xmem project directory not found!');
        process.exit(1);
    }

    const settingsDir = join(workspaceDir, '.vscode');
    if (!existsSync(settingsDir)) {
        mkdirSync(settingsDir, { recursive: true });
    }

    // Create workspace settings
    const settings = {
        "cursorai.apiKey": "",
        "cursorai.analysisLevel": "comprehensive",
        "cursorai.realTimeAnalysis": true,
        "cursorai.analysisDelay": 1000,
        "cursorai.maintainability.enabled": true,
        "cursorai.maintainability.threshold": 70,
        "cursorai.testGeneration.coverage": "unit",
        "cursorai.testGeneration.includeMocks": true,
        "cursorai.testGeneration.includeComments": true
    };

    require('fs').writeFileSync(
        join(settingsDir, 'settings.json'),
        JSON.stringify(settings, null, 2)
    );

    console.log('✅ Installation completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Set your API key in the workspace settings');
    console.log('2. Reload VSCode window');
    console.log('3. Open the xmem project in VSCode');
    console.log('4. Use the command palette (Ctrl+Shift+P) to access AIclarify commands');
}

install().catch(error => {
    console.error('❌ Installation failed:', error);
    process.exit(1);
}); 