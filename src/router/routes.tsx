import React, { lazy } from 'react'
import { useRoutes } from 'react-router-dom'
import PrivateRoute from '@/components/private-route'
import Login from '@/views/login/index'
import MainEntry from '@/views/main'
import HomeIndex from '@/views/index'
import Reminder from '@/views/reminder'
import TodoList from '@/views/todo'

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
          path: 'reminder',
          element: <PrivateRoute element={Reminder} meta={{
            requiresAuth: true,
            title: 'Reminder'
          }} />
        },
        {
          path: 'todo-list',
          element: <PrivateRoute element={TodoList} meta={{
            title: 'Todo List',
            requiresAuth: true,
          }} />
        }
      ]
    }
  ])

  return elements
}
