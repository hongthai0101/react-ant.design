export interface ILoginRequest {
    email: string
    password: string
    rememberMe: boolean
}

export interface IUser {
    email: string
    provider: string;
    socialId: string;
    firstName: string | null;
    lastName: string | null;
    photo?: string;
    role?: object;
    status?: object;
    createdAt: string
    updatedAt: string
}

export interface ILoginResponse {
    token: string
    userInfo: IUser
    expiresIn: number
    expireAt: number
    message: string
    statusCode: number
}