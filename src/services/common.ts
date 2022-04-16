import { IPanelResponse } from '@/models'
import http from '@/utils/http.util'

export function serviceGetPanelData(): Promise<IPanelResponse> {
  return http.get('/panel')
}
