import { ICapitalFlow, ICapitalFlowGetList, ICapitalFlowType, ListResponse } from '@/models'
import http from '@/utils/http.util'

export function serviceGetCapitalFlowType(): Promise<ListResponse<ListResponse<ICapitalFlowType>>> {
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
  return http.get('/capital-flows', { params })
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

export function serviceGetCapitalFlowAmount(params?: object): Promise<number> {
  return http.get('/capital-flows/amount', { params })
}

export function serviceGetCapitalFlowAmountGroup(params: object) {
  return http.get('/capital-flows/amount/group', { params })
}
