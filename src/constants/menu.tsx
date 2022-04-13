import React from 'react'
import {
  HomeOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  FormOutlined,
  UserOutlined,
  InsertRowLeftOutlined,
  SnippetsOutlined
} from '@ant-design/icons'

export const HOME_SIDER_MENU_LIST = [
  {
    path: '/home/index',
    icon: <HomeOutlined />,
    name: 'Home'
  },
  {
    path: '/home/reminders',
    icon: <ClockCircleOutlined />,
    name: 'Reminder'
  },
  {
    path: '/home/todo-lists',
    icon: <FileDoneOutlined />,
    name: 'Todo',
  },
  {
    path: '/home/tasks',
    icon: <ScheduleOutlined />,
    name: 'Task'
  },
  {
    path: '/home/logs',
    icon: <SnippetsOutlined />,
    name: 'Log'
  },
  {
    path: '/home/companies',
    icon: <InsertRowLeftOutlined />,
    name: 'Company'
  },
  {
    path: '',
    icon: <BarChartOutlined />,
    name: 'Financial',
    children: [
      {
        path: '/home/capital-flows',
        name: 'Liquidity',
      },
      {
        path: '/home/capital-flow-types',
        name: 'Create Category',
      }
    ]
  },
  {
    path: '/home/memorandums',
    icon: <FormOutlined />,
    name: 'My Memo',
    children: [
      {
        path: '/home/memorandums',
        name: 'List',
      },
      {
        path: '/home/memorandums/create',
        name: 'Create',
      }
    ]
  },
  {
    path: '/home/settings/base',
    icon: <UserOutlined />,
    name: 'Profile'
  }
]

export const SETTING_SIDER_MENU_LIST = [
  {
    path: '/home/settings/base',
    name: 'Profile'
  },
  {
    path: '/home/settings/inner-messages',
    name: 'Message'
  },
  {
    path: '/home/settings/notifications',
    name: 'Notification'
  },
  {
    path: '/home/settings/account',
    name: 'Account'
  },
]
