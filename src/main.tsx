import React from 'react'
import ReactDOM from 'react-dom'
import './assets/styles/global.scss'
import 'antd/dist/antd.css'
import AppRoute from './router'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import store from '@/store'
import vi_VN from 'antd/lib/locale-provider/vi_VN'
import moment from 'moment'
import 'moment/dist/locale/vi'

moment.locale('vi')

ReactDOM.render(
  //<React.StrictMode>
    <Provider store={store}>
    <ConfigProvider locale={vi_VN}>
      <AppRoute />
    </ConfigProvider>
    </Provider>,
  //</React.StrictMode>,
  document.getElementById('root')
)
