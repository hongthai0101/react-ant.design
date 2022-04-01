import http from '@/utils/http.util'
import { formatDate, fromNow } from '@/utils'
import { ICompany, ICompanyListItemResponse, ICompanyListResponse } from '@/models/company'

export async function serviceGetAllCompany(): Promise<ICompanyListResponse> {
  const res = await http.get('/companies');
  res.items = res.items.map((item: ICompanyListItemResponse) => {
    item.startDate = formatDate(item.startDate)
    item.__amount__ = `$${item.amount}`
    item.__jobDay__ = fromNow(item.startDate, item.endDate) + ' Sky'
    if (item.endDate) {
      item.endDate = formatDate(item.endDate)
    }
    if (item.expectLeaveDate) {
      item.expectLeaveDate = formatDate(item.expectLeaveDate)
    }
    item.__endDate__ = item.endDate ?? ' Now'
    return item
  });
  return res
}

export function serviceCreateCompany(data: Partial<ICompany>): Promise<ICompany> {
  return http.post('/companies', data, {
    headers: { successAlert: 'true' }
  })
}

export function serviceUpdateCompany(id: string, data: Partial<ICompany>): Promise<void> {
  return http.patch(`/companies/${id}`, data, {
    headers: { successAlert: 'true' }
  })
}

export function serviceDelCompany(id: string): Promise<void> {
  return http.delete(`/companies/${id}`, {
    headers: { successAlert: 'true' }
  })
}
