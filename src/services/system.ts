import http from '@/utils/http.util'

export function serviceGetSystemInfo() {
  return http.get('/systems')
}
