export * from './form.util';
export * from './date.util';
export * from './helper.util';

import { LOCAL_STORAGE } from '@/constants';

export function logout() {  
    setTimeout(() => {
      const localStorageWhiteList = [LOCAL_STORAGE.LOGIN_NAME]
      const localStorageLen = localStorage.length
      const allLocalStorageKey: string[] = []
  
      for (let i = 0; i < localStorageLen; i++) {
        const key = localStorage.key(i) as string
        allLocalStorageKey.push(key)
      }
  
      allLocalStorageKey.forEach(keyName => {
        if (localStorageWhiteList.indexOf(keyName) === -1) {
          localStorage.removeItem(keyName)
        }
      })
      sessionStorage.clear()
      location.reload()
    })
  }