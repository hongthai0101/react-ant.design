import { IInnerMessage, ListResponse } from '@/models'
import http from '@/utils/http.util'

export async function serviceGetInnerMessage(params?: object): Promise<ListResponse<IInnerMessage>> {
  return http.get('/inner-messages', {params})
}

export function serviceUpdateInnerMessageHasRead(id: unknown) {
  return http.put(`/inner-messages/${id}`, null, {
    headers: { successAlert: 'true' }
  })
}