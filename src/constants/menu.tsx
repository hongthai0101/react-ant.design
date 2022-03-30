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
    path: '/home/reminder',
    icon: <ClockCircleOutlined />,
    name: 'Reminder'
  },
  {
    path: '/home/todo-list',
    icon: <FileDoneOutlined />,
    name: 'Todo',
  },
  {
    path: '/home/todayTask',
    icon: <ScheduleOutlined />,
    name: 'Task'
  },
  {
    path: '/home/log',
    icon: <SnippetsOutlined />,
    name: 'Log'
  },
  {
    path: '/home/company',
    icon: <InsertRowLeftOutlined />,
    name: 'Company'
  },
  {
    path: '',
    icon: <BarChartOutlined />,
    name: 'Financial Management',
    children: [
      {
        path: '/home/capitalFlow',
        name: 'Liquidity',
      },
      {
        path: '/home/capitalFlow/type',
        name: 'Create Category',
      }
    ]
  },
  {
    path: '/home/memorandum',
    icon: <FormOutlined />,
    name: 'My Memo',
    children: [
      {
        path: '/home/memorandum',
        name: 'List',
      },
      {
        path: '/home/memorandum/create',
        name: 'Create',
      }
    ]
  },
  {
    path: '/home/setting/base',
    icon: <UserOutlined />,
    name: 'Profile'
  }
]

export const SETTING_SIDER_MENU_LIST = [
  {
    path: '/home/setting/base',
    name: 'Profile'
  },
  {
    path: '/home/setting/innerMessage',
    name: 'Message'
  },
  {
    path: '/home/setting/notification',
    name: 'Notification'
  },
  {
    path: '/home/setting/account',
    name: 'Account'
  },
]
