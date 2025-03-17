import * as vscode from 'vscode';
import axios from 'axios';

export interface APIConfig {
    apiKey: string;
    analysisLevel: 'basic' | 'detailed' | 'comprehensive';
    testFramework: 'jest' | 'mocha' | 'pytest';
}

export interface AnalysisRequest {
    code: string;
    language: string;
    analysisLevel: string;
}

export interface TestGenerationRequest {
    code: string;
    language: string;
    framework: string;
}

export class APIClient {
    private static instance: APIClient;
    private config: APIConfig;
    private baseUrl: string = 'https://api.cursorai.com/v1';

    private constructor(config: APIConfig) {
        this.config = config;
    }

    public static getInstance(config: APIConfig): APIClient {
        if (!APIClient.instance) {
            APIClient.instance = new APIClient(config);
        }
        return APIClient.instance;
    }

    public async analyzeCode(request: AnalysisRequest): Promise<any> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/analyze`,
                request,
                {
                    headers: {
                        'Authorization': `Bearer ${this.config.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    }

    public async generateTests(request: TestGenerationRequest): Promise<string[]> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/generate-tests`,
                request,
                {
                    headers: {
                        'Authorization': `Bearer ${this.config.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data.tests;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    }

    public updateConfig(config: Partial<APIConfig>): void {
        this.config = { ...this.config, ...config };
    }
} 