export interface ListResponse<T> {
    items: T[];
    total: number;
}

export interface ListRequest {
    page?: number;
    limit?: number;
    sort?: string;

    [key: string]: any;
}

export type IImage = {
    url: string,
    name: string
}

export type IPanelResponse = {
    consumption: string | number
    todayTaskCount: number
    unfinishedTodoListCount: number
    reminderCount: number
}