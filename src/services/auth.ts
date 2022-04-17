import { IForgotPasswordRequest, ILoginRequest, ILoginResponse, IRegisterRequest, IResetPasswordRequest, IVerifyAccountRequest } from '@/models';
import http from '@/utils/http.util'

export function serviceLogin(data: ILoginRequest): Promise<ILoginResponse> {
  return http.post('/login', data)
}

export function serviceRegister(data: IRegisterRequest): Promise<void> {
  return http.post('/register', data)
}

export function serviceForgotPassword(data: IForgotPasswordRequest): Promise<void> {
  return http.post('/forgot/password', data)
}

export function serviceResetPassword(data: IResetPasswordRequest): Promise<void> {
  return http.post('/reset/password', data)
}

export function serviceVerifyAccount(data: IVerifyAccountRequest): Promise<void> {
  return http.post('/confirm', data)
}
