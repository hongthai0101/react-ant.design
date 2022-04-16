import React, { lazy } from 'react'
import { useRoutes } from 'react-router-dom'
import PrivateRoute from '@/components/private-route'
import Login from '@/views/login/index'
import MainEntry from '@/views/main'
import HomeIndex from '@/views/index'
import Reminder from '@/views/reminder'
import TodoList from '@/views/todo'
import Task from '@/views/task'
import Company from '@/views/company'
import Log from '@/views/log'
import CreateLog from '@/views/log/CreateLog'
import CapitalFlow from '@/views/capital-flow'
import CapitalFlowType from '@/views/capital-flow/TypeList'
import Memorandum from '@/views/memorandum'
import MemorandumCreate from '@/views/memorandum/CreatePage'
import MemorandumDetail from '@/views/memorandum/DetailPage'

export function MainRoutes() {
  const _Login = <PrivateRoute element={Login} meta={{
    title: 'Admin Site'
  }} />
  const elements = useRoutes([
    {
      path: '/',
      element: _Login
    },
    {
      path: '/login',
      element: _Login
    },
    {
      path: '/home',
      element: <MainEntry />,
      children: [
        {
          path: 'index',
          element: <PrivateRoute element={HomeIndex} meta={{
            requiresAuth: true,
            title: 'Home'
          }} />,
        },
        {
          path: 'reminders',
          element: <PrivateRoute element={Reminder} meta={{
            requiresAuth: true,
            title: 'Reminder'
          }} />
        },
        {
          path: 'todo-lists',
          element: <PrivateRoute element={TodoList} meta={{
            title: 'Todo List',
            requiresAuth: true,
          }} />
        },
        {
          path: 'tasks',
          element: <PrivateRoute element={Task} meta={{
            requiresAuth: true,
            title: 'Task Today'
          }} />
        },
        {
          path: 'companies',
          element: <PrivateRoute element={Company} meta={{
            requiresAuth: true,
            title: 'Company'
          }} />
        },
        {
          path: 'logs',
          element: <PrivateRoute element={Log} meta={{
            requiresAuth: true,
            title: 'Log'
          }} />
        },
        {
          path: 'logs/create/:type',
          element: <PrivateRoute element={CreateLog} meta={{
            requiresAuth: true,
            title: 'Create Log'
          }} />
        },
        {
          path: 'capital-flows',
          element: <PrivateRoute element={CapitalFlow} meta={{
            title: 'Capital Flow',
            requiresAuth: true,
          }} />
        },
        {
          path: 'capital-flow-types',
          element: <PrivateRoute element={CapitalFlowType} meta={{
            title: 'Capital Flow Type',
            requiresAuth: true,
          }} />
        },

        {
          path: 'memorandums',
          element: <PrivateRoute element={Memorandum} meta={{
            requiresAuth: true,
            title: 'Memo List'
          }} />
        },
        {
          path: 'memorandums/create',
          element: <PrivateRoute element={MemorandumCreate} meta={{
            requiresAuth: true,
            title: 'Create Memo'
          }} />
        },
        {
          path: 'memorandums/update/:id',
          element: <PrivateRoute element={MemorandumCreate} meta={{
            requiresAuth: true,
            title: 'Update Memo'
          }} />
        },
        {
          path: 'memorandum/detail/:id',
          element: <PrivateRoute element={MemorandumDetail} meta={{
            requiresAuth: true,
          }} />
        },
      ]
    }
  ])

  return elements
}
