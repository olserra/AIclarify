import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = join(__dirname, '..');
const PACKAGE_DIR = join(ROOT_DIR, 'package');

async function publish() {
    console.log('🚀 Starting publish process...');

    // Check if package directory exists
    if (!existsSync(PACKAGE_DIR)) {
        console.error('❌ Package directory not found. Please run build first.');
        process.exit(1);
    }

    // Check for vsce
    try {
        execSync('vsce --version', { stdio: 'ignore' });
    } catch {
        console.log('📦 Installing vsce...');
        execSync('npm install -g @vscode/vsce', { stdio: 'inherit' });
    }

    // Check for publisher token
    if (!process.env.VSCE_TOKEN) {
        console.error('❌ VSCE_TOKEN environment variable not set.');
        console.log('Please set your VSCode Marketplace publisher token:');
        console.log('export VSCE_TOKEN=your-token-here');
        process.exit(1);
    }

    // Package the extension
    console.log('📦 Packaging extension...');
    execSync('vsce package', { stdio: 'inherit', cwd: PACKAGE_DIR });

    // Publish to marketplace
    console.log('📤 Publishing to VSCode Marketplace...');
    execSync('vsce publish', { stdio: 'inherit', cwd: PACKAGE_DIR });

    console.log('✅ Publish completed successfully!');
}

publish().catch(error => {
    console.error('❌ Publish failed:', error);
    process.exit(1);
}); 