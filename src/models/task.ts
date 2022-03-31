import { IImage, ListRequest } from "./common"

export interface ITask {
    createdAt: string
    updatedAt: string
    id: string
    uid: number
    content: string
    type: number
    images: Array<IImage>
    date: string
    count: number
}

export interface ITaskGetList extends ListRequest {
    startDate: string
    endDate: string
}

export interface TaskProp {
    text: string
    color: string
}

export interface ITaskUpdate {
    rollback: boolean
}

export interface ListTaskResponse<ITask> {
    data: {
        finished: ITask[]
        process: ITask[]
        unfinished: ITask[]
        wait: ITask
    };
    message: string
    statusCode: number
}
