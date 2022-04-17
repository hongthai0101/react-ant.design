import React, { useState, useEffect, useMemo } from 'react'
import config from '@/config'
import classNames from 'classnames'
import { Button, Input, Form, Modal } from 'antd'
import {  Link } from 'react-router-dom'
import {  serviceRegister } from '@/services'
import logo from '@/assets/img/common/logo.png'
import {
  LockOutlined,
  UserOutlined
} from '@ant-design/icons'
import { IRegisterRequest } from '@/models'
import AuthLayout from './layout';

export default function () {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  const handleSubmit = async () => {
    try {
      const values: IRegisterRequest = await form.validateFields();
      setLoading(true)
      serviceRegister({
        email: values.email.trim(),
        password: values.password.trim(),
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim()
      })
        .then((res) => {
          // Show mail notification
          setVisible(true)
        })
        .catch(() => { })
        .finally(() => {
          setLoading(false)
        })
    } catch (err) {
      console.log(err)
    }
  }

  const handleOk = () => {
    setVisible(false)
    form.resetFields();
  }

  const notification = useMemo(() => (
    <Modal
        title="Register successfully"
        visible={visible}
        onOk={handleOk}
        onCancel={handleOk}
      >
        <p>You have registered successfully, please check email <a href={`mailto:${form.getFieldValue('email')}`}>{form.getFieldValue('email')}</a> for verify account</p>
      </Modal>
  ), [visible])

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
              name="email"
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
              />
            </Form.Item>

            <Form.Item
              name="firstName"
              rules={[
                {
                  required: true
                }
              ]}
            >
              <Input
                placeholder="First Name"
                maxLength={32}
                autoComplete="off"
              />
            </Form.Item>

            <Form.Item
              name="lastName"
              rules={[
                {
                  required: true
                }
              ]}
            >
              <Input
                placeholder="Last Name"
                maxLength={32}
                autoComplete="off"
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
          <Link to="/login">If you already have an account, just login</Link>
          <Button
            type="primary"
            style={{ marginTop: '20px' }}
            size="large"
            loading={loading}
            block
            onClick={handleSubmit}
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </Button>
        </div>
      </div>
      {notification}
      </AuthLayout>
  )
}
