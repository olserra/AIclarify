#!/usr/bin/env node

import { analyzeProject } from './utils/analyzer';
import { join } from 'path';
import { readFileSync } from 'fs';

async function main() {
    try {
        const projectPath = process.cwd();
        const configPath = join(projectPath, 'aiclarify.config.js');

        let options = {};
        try {
            const config = require(configPath);
            options = config;
        } catch (error) {
            // Config file not found or invalid, using defaults
        }

        const result = await analyzeProject(projectPath, options);
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Analysis failed:', error);
        process.exit(1);
    }
}

main(); 