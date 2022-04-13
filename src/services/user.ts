import { ILoginRequest, ILoginResponse } from '@/models';
import http from '@/utils/http.util'

export function serviceLogin(data: ILoginRequest): Promise<ILoginResponse> {
  return http.post('/login', data)
}

export function serviceUpdateUser(data: object) {
  return http.post('/user/update', data, {
    headers: { successAlert: 'true' }
  })
}

export function serviceUpdateAvatar(data: object) {
  return http.post('/user/avatar', data, {
    headers: { successAlert: 'true' }
  });
}

export function serviceGetUserConfig() {
  return http.get('/userConfig')
}

export function serviceUpdateUserConfig(data: object) {
  return http.patch('/userConfig', data, {
    headers: { successAlert: 'true' }
  })
}
