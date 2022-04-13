import { ListRequest } from "./common"
import { ICompany } from "./company"

export interface ILog {
    createdAt: string
    updatedAt: string
    id: string
    uid: number
    companyId: string
    logType: number
    doneContent: string;
    undoneContent: string;
    planContent: string;
    summaryContent: string;

    [key: string]: any
}

export interface ILogListItemResponse extends ILog {
    __createdAt__: string
    __logType__?: string
    companyName: string
}

export interface ILogGetList extends ListRequest {
    startDate: string
    endDate: string
    company: string
    logType: number
    relations: string
}