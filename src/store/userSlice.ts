import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LOCAL_STORAGE } from '@/constants'
import { isPlainObject } from 'lodash'
import { serviceLoginByToken } from '@/services'
import type { AppDispatch } from '.'
import { formatDate } from '@/utils'
import { IUser } from '@/models'

export interface UserState {
  isLogin: boolean
  isLockScreen: boolean
  userInfo: IUser
  token: string | null
}

let localUser
const token = localStorage.getItem(LOCAL_STORAGE.TOKEN)
try {
  const r = JSON.parse(localStorage.getItem(LOCAL_STORAGE.USER) as string)
  if (isPlainObject(r)) {
    localUser = r
  }
} catch {}

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
    SET_USER_INFO: (state, action: PayloadAction<{userInfo: IUser, token: string}>) => {
      const {userInfo, token} = action.payload
      userInfo.createdAt &&= formatDate(userInfo.createdAt)
      if (userInfo) {
        state.isLogin = true
        localStorage.setItem(LOCAL_STORAGE.USER, JSON.stringify(userInfo))
        localStorage.setItem(LOCAL_STORAGE.LOGIN_NAME, userInfo.email)
        localStorage.setItem(LOCAL_STORAGE.TOKEN, action.payload.token)
      }
      state.userInfo = userInfo
      state.token = token
    }
  },
})

export const { SET_USER_INFO } = userSlice.actions

export const loginByToken: any = (token: string)  => async (dispatch: AppDispatch) => {
  const res = await serviceLoginByToken(token);
  const { userInfo } = res;
  return dispatch(SET_USER_INFO({userInfo, token}));
}

export default userSlice.reducer
