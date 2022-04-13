export interface ICompany {
    createdAt: string
    updatedAt: string
    id: string
    uid: number
    name: string
    remark: string
    amount: number
    startDate: string
    endDate?: string
    expectLeaveDate?: string
}

export interface ICompanyListItemResponse extends ICompany {
    startDate: string
    __amount__: string
    __jobDay__: string
    __endDate__: string
}

export interface ICompanyListResponse {
    items: ICompanyListItemResponse[]
    total: number
}