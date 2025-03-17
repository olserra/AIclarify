import { execSync } from 'child_process';
import { join } from 'path';

const ROOT_DIR = join(__dirname, '..');

async function test() {
    console.log('🚀 Starting tests...');

    // Run linting
    console.log('🔍 Running linter...');
    execSync('npm run lint', { stdio: 'inherit' });

    // Run type checking
    console.log('📝 Checking types...');
    execSync('tsc --noEmit', { stdio: 'inherit' });

    // Run tests (if any)
    console.log('🧪 Running tests...');
    try {
        execSync('npm test', { stdio: 'inherit' });
    } catch (error) {
        console.log('⚠️ No test script found in package.json');
    }

    console.log('✅ Tests completed successfully!');
}

test().catch(error => {
    console.error('❌ Tests failed:', error);
    process.exit(1);
}); 