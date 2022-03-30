export interface ListResponse<T> {
    items: T[];
    total: number;
    message: string
    statusCode: number
}

export interface ListRequest {
    page?: number;
    limit?: number;
    sort?: string;

    [key: string]: any;
}
