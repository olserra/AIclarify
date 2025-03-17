import { useCallback, useMemo } from 'react';
import { AnalysisOptions, AnalysisResult, ProjectInfo } from '@aiclarify/core';

interface UseProjectAnalysisProps {
    onAnalysisComplete?: (result: AnalysisResult, projectInfo: ProjectInfo) => void;
    onError?: (error: Error) => void;
}

export function useProjectAnalysis({ onAnalysisComplete, onError }: UseProjectAnalysisProps = {}) {
    const analyzeProject = useCallback(async (options: AnalysisOptions) => {
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(options),
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const data = await response.json();
            onAnalysisComplete?.(data.result, data.projectInfo);
            return data;
        } catch (error) {
            const err = error instanceof Error ? error : new Error('An error occurred');
            onError?.(err);
            throw err;
        }
    }, [onAnalysisComplete, onError]);

    const defaultOptions = useMemo<AnalysisOptions>(() => ({
        includePatterns: ['**/*.{js,jsx,ts,tsx}'],
        excludePatterns: ['**/node_modules/**', '**/dist/**', '**/build/**'],
        maxDepth: 10,
        timeout: 30000,
    }), []);

    return {
        analyzeProject,
        defaultOptions,
    };
} 