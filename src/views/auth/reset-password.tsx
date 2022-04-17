import React, { useEffect, useState } from 'react'
import config from '@/config'
import classNames from 'classnames'
import { Button, Input, Form } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { serviceResetPassword } from '@/services'
import logo from '@/assets/img/common/logo.png'
import {
  LockOutlined,
} from '@ant-design/icons'
import { IResetPasswordRequest } from '@/models'
import AuthLayout from './layout';

export default function () {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { hash } = useParams();  

  const handleSubmit = async () => {
    try {
      const values: IResetPasswordRequest = await form.validateFields();
      setLoading(true)
      serviceResetPassword({
        hash,
        password: values.password.trim()
      })
        .then((res) => {
          navigate('/login', {replace: true})
        })
        .catch(() => { })
        .finally(() => {
          setLoading(false)
        })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {

    return () => {
      form.setFieldsValue({})
      setLoading(false)
    }
  }, [])

  return (
   <AuthLayout>
      <div className="wrap">
        <div>
          <div className="logo-wrap">
            <img src={logo} className="logo" alt="" />
            <em>{config.title}</em>
          </div>

          <Form form={form}>
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
              />
            </Form.Item>

            <Form.Item
              name="confirmation_password"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input
                placeholder="Confirmation Password"
                prefix={<LockOutlined />}
                maxLength={32}
                type="password"
                autoComplete="off"
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
            {loading ? 'Loading...' : 'Reset Password'}
          </Button>
        </div>
      </div>
    </AuthLayout>
  )
}
