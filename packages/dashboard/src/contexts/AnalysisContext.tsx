import React, { createContext, useContext, useCallback, useMemo, useState } from 'react';
import { AnalysisResult, AnalysisOptions, ProjectInfo } from '@aiclarify/core';

interface AnalysisContextType {
    result: AnalysisResult | null;
    projectInfo: ProjectInfo | null;
    isAnalyzing: boolean;
    error: string | null;
    analyzeProject: (options: AnalysisOptions) => Promise<void>;
    clearAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeProject = useCallback(async (options: AnalysisOptions) => {
        try {
            setIsAnalyzing(true);
            setError(null);

            // TODO: Implement actual analysis logic here
            // This is just a placeholder
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(options),
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const data = await response.json();
            setResult(data.result);
            setProjectInfo(data.projectInfo);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsAnalyzing(false);
        }
    }, []);

    const clearAnalysis = useCallback(() => {
        setResult(null);
        setProjectInfo(null);
        setError(null);
    }, []);

    const value = useMemo(
        () => ({
            result,
            projectInfo,
            isAnalyzing,
            error,
            analyzeProject,
            clearAnalysis,
        }),
        [result, projectInfo, isAnalyzing, error, analyzeProject, clearAnalysis]
    );

    return (
        <AnalysisContext.Provider value={value}>
            {children}
        </AnalysisContext.Provider>
    );
}

export function useAnalysis() {
    const context = useContext(AnalysisContext);
    if (context === undefined) {
        throw new Error('useAnalysis must be used within an AnalysisProvider');
    }
    return context;
} 