import { IUser } from "./user"

export interface ILoginRequest {
    email: string
    password: string
    rememberMe: boolean
}

export interface IRegisterRequest {
    email: string
    password: string
    firstName: string
    lastName: string
}

export interface IForgotPasswordRequest {
    email: string
}

export interface IResetPasswordRequest {
    hash?: string
    password: string
}

export interface IVerifyAccountRequest {
    hash?: string
}

export interface ILoginResponse {
    token: string
    userInfo: IUser
    expiresIn: number
    expireAt: number
    message: string
    statusCode: number
}