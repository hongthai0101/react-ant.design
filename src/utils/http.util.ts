import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import CONFIG from '@/config'
import { message, notification } from 'antd'
import { IStore } from '@/store'
import { logout } from '.'
import { get } from 'lodash'

interface RespData {
  success: boolean
  errorCode: number
  msg?: string
  data?: any
  [key: string]: any
}

let exiting = false

function handleError(error: AxiosError) {
  const response = error.response
  const errors: Array<{message: string, property: string}> = get(response, 'data.errors', []);
  const description = errors.length > 0 ? errors[0].message : response?.statusText ?? 'The server is on a business trip';
  notification.error({
    message: `Error Code: ${response?.status ?? -1}`,
    description
  })
}

interface IAxiosInstance {
  get(url: string, config?: AxiosRequestConfig): Promise<Record<string, any>>
  delete(url: string, config?: AxiosRequestConfig): Promise<Record<string, any>>
  post(url: string, data?: any, config?: AxiosRequestConfig): Promise<Record<string, any>>
  put(url: string, data?: any, config?: AxiosRequestConfig): Promise<Record<string, any>>
}

const httpInstance: IAxiosInstance & AxiosInstance = axios.create({
  timeout: 60000,
  baseURL: CONFIG.http.baseURL
})

httpInstance.defaults.headers.common.isLoading = 'true'
httpInstance.defaults.headers.common.errorAlert = 'true'
Object.setPrototypeOf(httpInstance, axios)

export function setupInterceptor(store: IStore) {
  httpInstance.interceptors.request.use(function (config) {
    const method = config.method
    const token = store.getState().user.token

    if (token) {
      if (config.headers) {
        config.headers.Authorization = 'Bearer ' + token
      }
    }

    const data: Record<string, any> = {}

    if (method === 'post' || method === 'put') {
      if (config.data instanceof FormData) {
        for (let key in data) {
          config.data.append(key, data[key])
        }
      } else {
        config.data = Object.assign(data, config.data)
      }
    }

    return config
  }, function (error) {
    handleError(error)
    return Promise.reject(error)
  })


  httpInstance.interceptors.response.use(function (res) {
    const status = res.status;
    
    const headers = res.config.headers
    const data: RespData = res.data

    if (([200, 201, 204].includes(data.statusCode) || status === 204)) {
      if(headers?.successAlert) message.success(data.message || 'Successful operation')
    }else {
      if (headers?.errorAlert) {
        notification.error({
          message: `Error Code: ${data.statusCode ?? -1}`,
          description: 'The server is on a business trip'
        })
      }
      throw res
    }

    if (data.errorCode === 401 && !exiting) {
      exiting = true
      logout()
    }

    return res.data?.data || res
  }, function (error) {
    handleError(error)
    return Promise.reject(error)
  })
}


export default httpInstance
