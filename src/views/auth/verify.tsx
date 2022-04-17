import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { useNavigate, useParams } from 'react-router-dom'
import { serviceVerifyAccount } from '@/services'
import AuthLayout from './layout';

export default function () {
  const [loading, setLoading] = useState(false)
  const { hash } = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    serviceVerifyAccount({
      hash
    })
      .then((res) => {
        navigate('/login', { replace: true })
      })
      .catch(() => { })
      .finally(() => {
        setLoading(false)
      })

    return () => {
      setLoading(false)
    }
  }, [])

  return (
    <AuthLayout>
      <div className={classNames('login-bar', {
        'events-none': loading
      })}>
      </div>
    </AuthLayout>
  )
}
