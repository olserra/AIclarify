#!/usr/bin/env node

import { Command } from 'commander';
import { createServer } from './server';
import { watchProject } from './watcher';
import { analyzeProject } from './analyzer';

const program = new Command();

program
    .name('aiclarify')
    .description('AIclarify - Real-time code analysis')
    .version('0.2.5')
    .option('-p, --port <number>', 'port to run the analysis server on', '5000')
    .option('-d, --dir <path>', 'project directory to analyze', process.cwd())
    .action(async (options) => {
        try {
            const projectDir = options.dir;
            const port = parseInt(options.port);

            console.log('🚀 Starting AIclarify...');
            console.log(`📁 Project directory: ${projectDir}`);
            console.log(`🌐 Server port: ${port}`);

            // Start the web server
            const server = await createServer(port);

            // Start watching the project
            watchProject(projectDir, (files) => {
                analyzeProject(files).then((analysis) => {
                    // Emit analysis results to connected clients
                    server.io.emit('analysis', analysis);
                });
            });

            console.log('\n✨ AIclarify is running!');
            console.log(`📊 Analysis server: http://localhost:${port}`);
            console.log('\nPress Ctrl+C to stop');
        } catch (error) {
            console.error('❌ Error starting AIclarify:', error);
            process.exit(1);
        }
    });

program.parse(); 