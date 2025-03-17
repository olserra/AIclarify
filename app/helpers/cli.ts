#!/usr/bin/env node

import { Command } from 'commander';
import { analyzeProject } from './analyzer';
import { createServer } from './server';
import * as fs from 'fs';
import * as path from 'path';
import { watchProject } from './watcher';

const program = new Command();

program
    .name('aiclarify')
    .description('Real-time code quality analysis tool')
    .version('0.2.5');

program
    .command('analyze')
    .description('Analyze your codebase and start the metrics server')
    .option('-p, --port <number>', 'Port to run the server on', '5000')
    .option('-w, --watch', 'Watch for file changes', false)
    .option('-e, --exclude <patterns...>', 'Patterns to exclude from analysis')
    .action(async (options) => {
        try {
            // Get all files in the current directory
            const files = getAllFiles(process.cwd(), options.exclude || []);

            // Start the server
            const { io } = await createServer(parseInt(options.port));

            // Initial analysis
            const results = await analyzeProject(files);
            io.emit('analysis', results);

            // Watch for changes if --watch is enabled
            if (options.watch) {
                watchProject(process.cwd(), async (changedFiles: string[]) => {
                    const newResults = await analyzeProject(changedFiles);
                    io.emit('analysis', newResults);
                });
            }

            console.log(`🚀 Analysis complete! View metrics at http://localhost:${options.port}`);
        } catch (error) {
            console.error('❌ Error:', error);
            process.exit(1);
        }
    });

program.parse();

function getAllFiles(dir: string, excludePatterns: string[]): string[] {
    const files: string[] = [];

    function traverse(currentDir: string) {
        const items = fs.readdirSync(currentDir);

        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            // Skip node_modules, .git, and excluded patterns
            if (
                item === 'node_modules' ||
                item === '.git' ||
                excludePatterns.some(pattern => fullPath.includes(pattern))
            ) {
                continue;
            }

            if (stat.isDirectory()) {
                traverse(fullPath);
            } else if (stat.isFile()) {
                files.push(fullPath);
            }
        }
    }

    traverse(dir);
    return files;
} 