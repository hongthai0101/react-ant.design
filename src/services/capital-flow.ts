import { ICapitalFlow, ICapitalFlowAmount, ICapitalFlowAmountItem, ICapitalFlowAmountRequest, ICapitalFlowCalculateFundResponse, ICapitalFlowGetList, ICapitalFlowType, ListResponse } from '@/models'
import http from '@/utils/http.util'

export function serviceGetCapitalFlowType(): Promise<ListResponse<ICapitalFlowType>> {
  return http.get('/capital-flow-types')
}

export function serviceDeleteCapitalFlowType(id: string): Promise<void> {
  return http.delete(`/capital-flow-types/${id}`, {
    headers: { successAlert: 'true' }
  })
}

export function serviceUpdateCapitalFlowType(id: string, data: Partial<ICapitalFlowType>): Promise<void> {
  return http.patch(`/capital-flow-types/${id}`, data, {
    headers: { successAlert: 'true' }
  })
}

export function serviceCreateCapitalFlowType(data: Partial<ICapitalFlowType>): Promise<ICapitalFlowType> {
  return http.post('/capital-flow-types', data, {
    headers: { successAlert: 'true' }
  })
}

export function serviceGetCapitalFlow(params: ICapitalFlowGetList): Promise<ListResponse<ICapitalFlow>> {
  params = {...params, relations: 'type'}
  return http.get('/capital-flows', { params })
}

export function serviceGetCalculateFunds(params: ICapitalFlowGetList): Promise<ICapitalFlowCalculateFundResponse> {
  return http.get('/capital-flows/calculate-funds', { params })
}

export function serviceDeleteCapitalFlow(id: string): Promise<void> {
  return http.delete(`/capital-flows/${id}`, {
    headers: { successAlert: 'true' }
  })
}

export function serviceUpdateCapitalFlow(id: string, data: Partial<ICapitalFlow>): Promise<void> {
  return http.patch(`/capital-flows/${id}`, data, {
    headers: { successAlert: 'true' }
  })
}

export function serviceCreateCapitalFlow(data: Partial<ICapitalFlow>): Promise<ICapitalFlow> {
  return http.post('/capital-flows', data)
}

export function serviceGetCapitalFlowAmount(params?: ICapitalFlowAmountRequest): Promise<ICapitalFlowAmountItem[]> {
  return http.get('/capital-flows/amount', { params })
}

export function serviceGetCapitalFlowAmountGroup(params: object) {
  return http.get('/capital-flows/amount/group', { params })
}
