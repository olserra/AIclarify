import chokidar from 'chokidar';
import * as path from 'path';

export function watchProject(projectDir: string, callback: (files: string[]) => void) {
    const watcher = chokidar.watch(projectDir, {
        ignored: [
            /(^|[\/\\])\../, // dotfiles
            'node_modules',
            'dist',
            'build',
            '.git',
            'coverage',
            '**/*.test.*',
            '**/*.spec.*'
        ],
        persistent: true,
        ignoreInitial: false
    });

    let changedFiles: string[] = [];

    // Debounce function
    const debounce = (fn: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    };

    // Debounced callback
    const debouncedCallback = debounce((files: string[]) => {
        callback(files);
        changedFiles = [];
    }, 1000);

    watcher
        .on('add', (filePath) => {
            console.log(`📝 File added: ${path.relative(projectDir, filePath)}`);
            changedFiles.push(filePath);
            debouncedCallback(changedFiles);
        })
        .on('change', (filePath) => {
            console.log(`📝 File changed: ${path.relative(projectDir, filePath)}`);
            changedFiles.push(filePath);
            debouncedCallback(changedFiles);
        })
        .on('unlink', (filePath) => {
            console.log(`📝 File deleted: ${path.relative(projectDir, filePath)}`);
            changedFiles.push(filePath);
            debouncedCallback(changedFiles);
        });

    return watcher;
} 