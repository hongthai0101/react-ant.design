import http from '@/utils/http.util'

export function serviceCreateReminder(data: object) {
  return http.post('/reminders', data, {
    headers: { successAlert: 'true' }
  })
}

export function serviceGetReminder(params?: object) {
  return http.get('/reminders', { params })
}

export function serviceDeleteReminder(id: unknown) {
  return http.delete(`/reminders/${id}`, {
    headers: { successAlert: 'true' }
  })
}

export function serviceUpdateReminder(id: unknown, data: object) {
  return http.put(`/reminders/${id}`, data, {
    headers: {
      successAlert: 'true',
    }
  })
}
