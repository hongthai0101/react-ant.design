import { ListRequest } from "./common"

export interface IReminder {
    createdAt: string
    updatedAt: string
    id: string
    uid: number
    content: string
    type: number

    [key: string]: any
} 

export interface IReminderGetList extends ListRequest {
    type: number,
    startDate: Date
    endDate: number
}