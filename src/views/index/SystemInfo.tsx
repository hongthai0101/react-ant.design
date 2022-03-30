import React, { useCallback, useEffect, useMemo, useState } from 'react'
import './style.scss'
import bytes from 'bytes'
import CONFIG from '@/config'
import { Row, Col, Card, Progress, Empty } from 'antd'
import {formatDateTime} from '@/utils'
// import { totalPercentage, formatDateTime } from '@/utils'
// import { serviceGetInnerMessage } from '@/services'

interface Props {
  systemInfo: Record<string, any>
}

const statusColor = (percentage: number) => {
  if (percentage < 40) return '#52c41a'
  if (percentage < 80) return '#ffa500'
  return '#f50'
}
let timer: any

const System: React.FC<Props> = ({ systemInfo }) => {
  const [curSystemTime, setCurSystemTime] = useState('')
  const [messageList, setMessageList] = useState([])
  const [loading, setLoading] = useState(true)

  const memPercentage = useMemo(() => {
    //return totalPercentage(systemInfo.totalmem, systemInfo.freemem)
    return 1;
  }, [systemInfo.totalmem, systemInfo.freemem])

  const countdown = useCallback(() => {
    clearTimeout(timer)
    const timeDiff = systemInfo.currentSystemTime + (Date.now() - systemInfo.currentSystemTime)
    setCurSystemTime(formatDateTime(timeDiff))

    timer = setTimeout(() => {
      countdown()
    }, 1000)
  }, [systemInfo.currentSystemTime])

  useEffect(() => {
    countdown()

    return () => {
      clearTimeout(timer)
    }
  }, [countdown])

  useEffect(() => {
    // serviceGetInnerMessage({ pageSize: 5 })
    // .then(res => {
    //   setLoading(false)
    //   setMessageList(res.rows)
    // })
  }, [])

  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24}} className="system-data">
      <Col xl={8} lg={12} md={12} sm={24} xs={24}>
        <Card
          title="System parameters"
          hoverable
          loading={!systemInfo.nodeVersion}
        >
          <p className="item-text">
            <em>System type：</em>
            {systemInfo.platform}{systemInfo.arch}
          </p>
          <p className="item-text">
            <em>Node：</em>
            {systemInfo.nodeVersion}
          </p>
          <p className="item-text">
            <em>MySQL：</em>
            {systemInfo.mysqlVersion}
          </p>
          <p className="item-text">
            <em>Environment: </em>
            {CONFIG.isProduction ? 'Production' : 'Development'}
          </p>
          <p className="item-text">
            <em>System time: </em>
            {curSystemTime}
          </p>
        </Card>
      </Col>
      <Col xl={8} lg={12} md={12} sm={24} xs={24}>
        <Card
          title="Message"
          hoverable
          loading={loading}
        >
          {messageList.length > 0 ? (
            messageList.map((msg: any) => (
              <p className="item-text" key={msg.id}>
                <em>{msg.content}</em>
              </p>
            ))
          ) : (
            <Empty />
          )}
        </Card>
      </Col>
      <Col xl={8} lg={12} md={12} sm={24} xs={24}>
        <Card
          title={`Memory usage(${bytes(systemInfo.totalmem)})`}
          hoverable
          className="mem"
        >
          <Progress
            type="circle"
            percent={memPercentage}
            strokeColor={statusColor(memPercentage)}
            format={percent => percent + '%'}
          />
          <div className="surplus">Remaining{bytes(systemInfo.freemem)}</div>
        </Card>
      </Col>
    </Row>
  )
}

export default React.memo(System)
