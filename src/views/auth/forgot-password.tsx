import React, { useState, useMemo } from 'react'
import config from '@/config'
import classNames from 'classnames'
import { Button, Input, Form, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { serviceForgotPassword } from '@/services'
import logo from '@/assets/img/common/logo.png'
import {
  UserOutlined
} from '@ant-design/icons'
import { IForgotPasswordRequest } from '@/models'
import AuthLayout from './layout';

export default function () {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  const handleSubmit = async () => {
    try {
      const values: IForgotPasswordRequest = await form.validateFields();
      setLoading(true)
      serviceForgotPassword({
        email: values.email.trim()
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
        title="Forgot password successfully"
        visible={visible}
        onOk={handleOk}
        onCancel={handleOk}
      >
        <p>You have forgot password successfully, please check email <a href={`mailto:${form.getFieldValue('email')}`}>{form.getFieldValue('email')}</a> for reset password</p>
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
          </Form>

          <div className={classNames('login-bar', {
            'events-none': loading
          })}>
          </div>
          <Link to="/login">Login</Link>
          <Button
            type="primary"
            style={{ marginTop: '20px' }}
            size="large"
            loading={loading}
            block
            onClick={handleSubmit}
          >
            {loading ? 'Loading...' : 'Forgot Password'}
          </Button>
        </div>
      </div>
      {notification}
    </AuthLayout>
  )
}
