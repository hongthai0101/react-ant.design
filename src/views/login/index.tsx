import React, { useState, useEffect, useMemo } from 'react'
import './style.scss'
import Footer from '@/components/footer'
import qs from 'query-string'
import config from '@/config'
import classNames from 'classnames'
import { isEmpty } from 'lodash'
import { Button, Input, message, Form } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { loginByToken, SET_USER_INFO } from '@/store/userSlice'
import { serviceLogin } from '@/services'
import { LOCAL_STORAGE } from '@/constants'
import { useAppDispatch } from '@/hooks'
import logo from '@/assets/img/common/logo.png'
import {
  LockOutlined,
  UserOutlined
} from '@ant-design/icons'
import { ILoginRequest } from '@/models'

const LOGIN_NAME = localStorage.getItem(LOCAL_STORAGE.LOGIN_NAME) || ''

export default function () {
  const navigate = useNavigate()
  const location = useLocation()

  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const redirectUrl = useMemo(() => {
    const url = qs.parse(location.search).redirectUrl as string
    return url || '/home/index'
  }, [])

  const handleSubmit = async () => {
    try {
      const values: ILoginRequest = await form.validateFields()
      setLoading(true)
      serviceLogin({
        email: values.email.trim(),
        password: values.password.trim()
      })
        .then(({ token, userInfo }) => {
          dispatch(SET_USER_INFO({ token, userInfo }))
          navigate(redirectUrl, { replace: true })
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false)
        })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const query = qs.parse(location.search)
    const { token, state } = query    

    if (Number(state) === 0) {
      message.error('Authorization failed, please log in again')
      return
    }

    if (token) {
      dispatch(loginByToken(token))
        .then((res: any) => {
          if (!isEmpty(res.userInfo)) {
            navigate(redirectUrl, { replace: true })
          }
        })
    }
  }, [history, location.search])

  useEffect(() => {
    if (config.isDevelopment) {
      form.setFieldsValue({
        email: 'john.doe@example.com',
        password: 'secret'
      })
    }
  }, [])

  return (
    <section className="login-page">
      <div className="wrap">
        <div>
          <div className="logo-wrap">
            <img src={logo} className="logo" alt="" />
            <em>{config.title}</em>
          </div>

          <Form form={form}>
            <Form.Item
              name="email"
              initialValue={LOGIN_NAME}
              rules={[
                {
                  required: true
                },
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                }
              ]}
            >
              <Input
                placeholder="Email"
                prefix={<UserOutlined />}
                maxLength={32}
                autoComplete="off"
                onPressEnter={handleSubmit}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true
                }
              ]}
            >
              <Input
                placeholder="Password"
                prefix={<LockOutlined />}
                maxLength={32}
                type="password"
                autoComplete="off"
                onPressEnter={handleSubmit}
              />
            </Form.Item>
          </Form>

          <div className={classNames('login-bar', {
            'events-none': loading
          })}>
          </div>

          <Button
            type="primary"
            style={{ marginTop: '20px' }}
            size="large"
            loading={loading}
            block
            onClick={handleSubmit}
          >
            {loading ? 'Loading...' : 'Sign In'}
          </Button>
        </div>
      </div>
      <Footer />
    </section>
  )
}
