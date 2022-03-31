import { ITask, ITaskGetList, ITaskUpdate, ListTaskResponse } from '@/models'
import http from '@/utils/http.util'

export function serviceCreateTask(data: Partial<ITask>): Promise<ITask> {
  return http.post('/tasks', data, {
    headers: { successAlert: 'true' }
  })
}

export function serviceGetTask(params?: ITaskGetList): Promise<ListTaskResponse<ITask>> {
  return http.get('/tasks', { params })
}

export function serviceDeleteTask(id: string): Promise<void> {
  return http.delete(`/tasks/${id}`)
}

export function serviceUpdateTask(id: string, data: ITaskUpdate): Promise<void> {
  return http.patch(`/tasks/${id}`, data)
}
