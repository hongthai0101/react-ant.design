import { ICapitalFlowType } from "./capital-flow-type"
import { ListRequest } from "./common"

export interface ICapitalFlow {
    createdAt: string
    updatedAt: string
    id: string
    uid: number
    type: ICapitalFlowType
    remark: string
    price: number
    
    [key: string]: any
}

export interface ICapitalFlowGetList extends ListRequest {
    type: string
    startDate: string
    endDate: string
}

export type ICapitalFlowAmountRequest = {
    startDate: string
    endDate: string
}

export type ICapitalFlowAmountItem = {
    date: string
    name: string
    price: number
    type: number
}
export interface ICapitalFlowAmount {
    data: ICapitalFlowAmountItem[];
    message: string
    statusCode: number
}

export type ICapitalFlowCalculateFundResponse = {
    income: number | string,
    consumption: number | string,
    available: number | string
  }