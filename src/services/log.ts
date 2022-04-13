import http from '@/utils/http.util'
import { formatDate, getWeek } from '@/utils'
import { LOG_LIST } from '@/views/log/constants'
import { ILog, ILogGetList, ILogListItemResponse, ListResponse } from '@/models'

export function serviceCreateLog(data: Partial<ILog>): Promise<ILog> {
  return http.post('/logs', data, {
    headers: { successAlert: 'true' }
  })
}

export function serviceUpdateLog(data: Partial<ILog>): Promise<void> {
  return http.patch(`/logs/${data.id}`, data, {
    headers: { successAlert: 'true' }
  })
}

export async function serviceGetLogList(params: ILogGetList): Promise<ListResponse<ILogListItemResponse>> {
  const payload = { ...params, relations: 'company' };
  const res: ListResponse<ILogListItemResponse> = await http.get('/logs', {params: payload})
  res.items = res.items.map(item => {
    item.__createdAt__ = `${formatDate(item.createdAt)} ${getWeek(item.createdAt)}`
    const lType = LOG_LIST.find(el => Number(el.key) === Number(item.logType))
    item.__logType__ = lType?.name
    item.companyName ||= 'Nothing'
    return item
  })
  return res
}

export function serviceDeleteLog(id: string): Promise<void> {
  return http.delete(`/logs/${id}`, {
    headers: { successAlert: 'true' }
  })
}

export function serviceGetLogById(id: string): Promise<ILog> {
  return http.get(`/logs/${id}`)
}
