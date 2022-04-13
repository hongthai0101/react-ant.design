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
}

export interface ICapitalFlowGetList extends ListRequest {
    type: string
    startDate: string
    endDate: string
}