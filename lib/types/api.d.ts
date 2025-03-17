import { type ApiResponse } from './models';

// API Request Types
export interface ApiRequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any;
    params?: Record<string, string>;
}

export interface ApiRequestConfig extends ApiRequestOptions {
    baseURL?: string;
    timeout?: number;
    withCredentials?: boolean;
}

// API Error Types
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
}

// API Client Types
export interface ApiClient {
    request<T = any>(config: ApiRequestConfig): Promise<ApiResponse<T>>;
    get<T = any>(url: string, config?: ApiRequestOptions): Promise<ApiResponse<T>>;
    post<T = any>(url: string, data?: any, config?: ApiRequestOptions): Promise<ApiResponse<T>>;
    put<T = any>(url: string, data?: any, config?: ApiRequestOptions): Promise<ApiResponse<T>>;
    delete<T = any>(url: string, config?: ApiRequestOptions): Promise<ApiResponse<T>>;
    patch<T = any>(url: string, data?: any, config?: ApiRequestOptions): Promise<ApiResponse<T>>;
}

// API Endpoint Types
export interface ApiEndpoint {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    handler: (req: any, res: any) => Promise<ApiResponse>;
}

// API Middleware Types
export interface ApiMiddleware {
    (req: any, res: any, next: () => void): void | Promise<void>;
}

// API Route Types
export interface ApiRoute {
    path: string;
    endpoints: ApiEndpoint[];
    middleware?: ApiMiddleware[];
} 