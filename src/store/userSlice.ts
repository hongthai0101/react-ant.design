import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LOCAL_STORAGE } from '@/constants'
import { isPlainObject } from 'lodash'
import { serviceLoginByToken } from '@/services'
import type { AppDispatch } from '.'
import { formatDate, logout } from '@/utils'
import { ILoginResponse, IUser } from '@/models'
import moment from 'moment'

type IToken = {
  token: string
  expireAt: number
  expiresIn: number
}
export interface UserState {
  isLogin: boolean
  isLockScreen: boolean
  userInfo: IUser
  token?: IToken
}

const token: IToken = JSON.parse(localStorage.getItem(LOCAL_STORAGE.TOKEN) as string);
if (token && moment().unix() > token.expireAt) logout();

let localUser
try {
  const r = JSON.parse(localStorage.getItem(LOCAL_STORAGE.USER) as string)
  if (isPlainObject(r)) {
    localUser = r
  }
} catch { }

const initialState: UserState = {
  isLogin: !!localUser,
  isLockScreen: false,
  userInfo: localUser || {
    provider: '',
    createdAt: '',
    username: '',
    loginName: '',
    email: '',
    photo: '',
    socialId: '',
    role: undefined,
    status: undefined
  },
  token
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    SET_USER_INFO: (state, action: PayloadAction<ILoginResponse>) => {
      const { userInfo, token, expireAt, expiresIn } = action.payload
      userInfo.createdAt &&= formatDate(userInfo.createdAt)
      if (userInfo) {
        state.isLogin = true
        localStorage.setItem(LOCAL_STORAGE.USER, JSON.stringify(userInfo))
        localStorage.setItem(LOCAL_STORAGE.LOGIN_NAME, userInfo.email)
        localStorage.setItem(LOCAL_STORAGE.TOKEN, JSON.stringify({ expireAt, expiresIn, token }))
      }
      state.userInfo = userInfo
      state.token = {
        token, expireAt, expiresIn
      }
    }
  },
})

export const { SET_USER_INFO } = userSlice.actions

export const loginByToken: any = (token: string) => async (dispatch: AppDispatch) => {
  const res = await serviceLoginByToken(token);
  return dispatch(SET_USER_INFO(res));
}

export default userSlice.reducer
