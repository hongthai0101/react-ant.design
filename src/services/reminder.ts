import { IReminder, IReminderGetList, ListResponse } from '@/models';
import http from '@/utils/http.util'

export function serviceCreateReminder(data: Partial<IReminder>) {
  return http.post('/reminders', data, {
    headers: { successAlert: 'true' }
  })
}

export async function serviceGetReminder(params?: IReminderGetList): Promise<ListResponse<IReminder>> {
  return http.get('/reminders', { params });
}

export function serviceDeleteReminder(id: string) {
  return http.delete(`/reminders/${id}`, {
    headers: { successAlert: 'true' }
  })
}

export function serviceUpdateReminder(id: string, data: Partial<IReminder>) {
  return http.patch(`/reminders/${id}`, data, {
    headers: {
      successAlert: 'true',
    }
  })
}
