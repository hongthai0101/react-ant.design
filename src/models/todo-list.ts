import { ListRequest } from "./common"

export interface ITodoList {
    createdAt: string
    updatedAt: string
    id: string
    uid: number
    content: string
    status: number
} 

export interface ITodoGetList extends ListRequest {
    startDate: Date
    endDate: number
}