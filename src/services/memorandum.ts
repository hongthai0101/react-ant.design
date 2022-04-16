import { IMemorandum, ListRequest, ListResponse } from '@/models'
import http from '@/utils/http.util'

export function serviceCreateMemorandum(data: Partial<IMemorandum>): Promise<IMemorandum> {
  return http.post('/memorandums', data, {
    headers: { successAlert: 'true' }
  })
}

export function serviceGetMemorandum(params?: ListRequest): Promise<ListResponse<IMemorandum>> {
  return http.get('/memorandums', {
    params
  })
}

export function serviceGetMemorandumById(id: string) {
  return http.get(`/memorandums/${id}`)
}

export function serviceDeleteMemorandum(id?: string): Promise<void> {
  return http.delete(`/memorandums/${id}`, {
    headers: { successAlert: 'true' }
  })
}

export function serviceUpdateMemorandum(id: string, data: Partial<IMemorandum>) {
  return http.put(`/memorandums/${id}`, data, {
    headers: { successAlert: 'true' }
  })
}
