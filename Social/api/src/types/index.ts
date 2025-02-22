export interface CustomError extends Error {
    statusCode?: number;
    errors?: Record<string, { message: string }>;
    code?: number;
    keyValue?: Record<string, string>;
}
    