import { ITodoGetList, ITodoList, ListResponse } from '@/models'
import http from '@/utils/http.util'

export function serviceCreateTodoList(data: Partial<ITodoList>) {
  return http.post('/todo-lists', data, {
    headers: {
      successAlert: 'true'
    }
  })
}

export function serviceGetTodoList(params?: ITodoGetList): Promise<ListResponse<ITodoList>> {
  return http.get('/todo-lists', { params })
}

export function serviceDeleteTodoList(id: string) {
  return http.delete(`/todo-lists/${id}`, {
    headers: { successAlert: 'true' }
  })
}

export function serviceUpdateTodoList(id: string, data: Partial<ITodoList>) {
  return http.patch(`/todo-lists/${id}`, data)
}
