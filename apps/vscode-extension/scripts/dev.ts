import { execSync, spawn } from 'child_process';
import { watch } from 'fs';
import { join } from 'path';

const ROOT_DIR = join(__dirname, '..');
const SRC_DIR = join(ROOT_DIR, 'src');

async function dev() {
    console.log('🚀 Starting development mode...');

    // Start TypeScript compiler in watch mode
    const tsc = spawn('tsc', ['-w', '-p', './'], {
        stdio: 'inherit'
    });

    // Watch for changes in src directory
    watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
        if (filename) {
            console.log(`📝 File changed: ${filename}`);
        }
    });

    // Handle process termination
    process.on('SIGINT', () => {
        console.log('👋 Shutting down...');
        tsc.kill();
        process.exit(0);
    });

    // Start VSCode extension host
    console.log('💻 Starting VSCode extension host...');
    execSync('code --extensionDevelopmentPath=.', { stdio: 'inherit' });
}

dev().catch(error => {
    console.error('❌ Development mode failed:', error);
    process.exit(1);
}); 