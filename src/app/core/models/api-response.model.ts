export interface ApiResponse<T> {
    data: T;
    Model: T;
    message: string;
    statusCode: number;
    error: boolean;
}
