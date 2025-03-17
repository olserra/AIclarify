#!/usr/bin/env node

import { Command } from 'commander';
import { createServer } from './server';
import { watchProject } from './watcher';
import { analyzeProject } from './analyzer';
import { open } from 'open';
import * as path from 'path';

const program = new Command();

program
    .name('aiclarify-studio')
    .description('AIclarify Studio - Real-time code analysis dashboard')
    .version('0.1.0')
    .option('-p, --port <number>', 'port to run the dashboard on', '5000')
    .option('-d, --dir <path>', 'project directory to analyze', process.cwd())
    .option('--no-open', 'do not automatically open the dashboard in browser')
    .action(async (options) => {
        try {
            const projectDir = path.resolve(options.dir);
            const port = parseInt(options.port);

            console.log('🚀 Starting AIclarify Studio...');
            console.log(`📁 Project directory: ${projectDir}`);
            console.log(`🌐 Dashboard port: ${port}`);

            // Start the web server
            const server = await createServer(port);

            // Start watching the project
            watchProject(projectDir, (files) => {
                analyzeProject(files).then((analysis) => {
                    // Emit analysis results to connected clients
                    server.io.emit('analysis', analysis);
                });
            });

            // Open the dashboard in browser
            if (options.open) {
                await open(`http://localhost:${port}`);
            }

            console.log('\n✨ AIclarify Studio is running!');
            console.log(`📊 Dashboard: http://localhost:${port}`);
            console.log('\nPress Ctrl+C to stop');
        } catch (error) {
            console.error('❌ Error starting AIclarify Studio:', error);
            process.exit(1);
        }
    });

program.parse(); 