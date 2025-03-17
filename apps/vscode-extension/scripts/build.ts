import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = join(__dirname, '..');
const DIST_DIR = join(ROOT_DIR, 'dist');
const PACKAGE_DIR = join(ROOT_DIR, 'package');

async function build() {
    console.log('🚀 Starting build process...');

    // Clean previous builds
    console.log('🧹 Cleaning previous builds...');
    execSync('rimraf dist package', { stdio: 'inherit' });

    // Install dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    // Compile TypeScript
    console.log('⚙️ Compiling TypeScript...');
    execSync('tsc -p ./', { stdio: 'inherit' });

    // Copy package.json and other necessary files
    console.log('📋 Copying package files...');
    if (!existsSync(PACKAGE_DIR)) {
        mkdirSync(PACKAGE_DIR);
    }

    // Copy package.json and modify it for production
    const packageJson = require(join(ROOT_DIR, 'package.json'));
    delete packageJson.scripts;
    delete packageJson.devDependencies;
    require('fs').writeFileSync(
        join(PACKAGE_DIR, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    );

    // Copy README if it exists
    if (existsSync(join(ROOT_DIR, 'README.md'))) {
        copyFileSync(
            join(ROOT_DIR, 'README.md'),
            join(PACKAGE_DIR, 'README.md')
        );
    }

    // Copy LICENSE if it exists
    if (existsSync(join(ROOT_DIR, 'LICENSE'))) {
        copyFileSync(
            join(ROOT_DIR, 'LICENSE'),
            join(PACKAGE_DIR, 'LICENSE')
        );
    }

    // Copy dist files
    console.log('📦 Copying compiled files...');
    execSync(`cp -r ${DIST_DIR}/* ${PACKAGE_DIR}/`, { stdio: 'inherit' });

    console.log('✅ Build completed successfully!');
}

build().catch(error => {
    console.error('❌ Build failed:', error);
    process.exit(1);
}); 