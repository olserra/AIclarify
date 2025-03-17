import { NextApiRequest, NextApiResponse } from 'next';
import { analyzeProject } from '@aiclarify/core';
import { AnalysisOptions } from '@aiclarify/core';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const options: AnalysisOptions = req.body;
        const projectPath = process.cwd();

        const result = await analyzeProject(projectPath, options);
        res.status(200).json(result);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            message: 'Analysis failed',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
} 