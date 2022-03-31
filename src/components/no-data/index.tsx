import React from 'react'
import './style.scss'
import { Button, Result } from 'antd'
import NoDataSvg from '@/assets/img/common/no-data.svg'

interface Props {
  onClick(e: React.MouseEvent): void
  message?: string
}

const NoData: React.FC<Props> = ({ onClick, message = 'No data' }) => {
  return (
    <Result
      className="no-data"
      icon={<img src={NoDataSvg} className="udn" alt="" />}
      title={message}
      extra={<Button type="primary" onClick={onClick}>Create</Button>}
      status="info"
      style={{ marginTop: '50px' }}
    />
  )
}

export default React.memo(NoData)
