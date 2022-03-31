export interface ILoginRequest {
    email: string
    password: string
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
    message: string
    statusCode: number
}