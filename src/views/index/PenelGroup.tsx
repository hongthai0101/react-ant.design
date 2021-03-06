import React, { useState, useEffect, useRef } from 'react'
import './style.scss'
import { Row, Col, Statistic } from 'antd'
import { Link } from 'react-router-dom'
import { serviceGetPanelData } from '@/services'
import {
  PropertySafetyFilled,
  ScheduleFilled,
  FileTextFilled,
  AlertFilled
} from '@ant-design/icons'

const PanelGroup = () => {
  const isInit = useRef<boolean>(false)
  const [state, setState] = useState([
    {
      title: 'Spend',
      total: '0',
      Icon: <PropertySafetyFilled className="icon" />,
      suffix: '$',
      path: '/home/capital-flows'
    },
    {
      title: 'Todo',
      total: '0',
      Icon: <ScheduleFilled className="icon" />,
      path: '/home/today-tasks'
    },
    {
      title: 'Activity',
      total: '0',
      Icon: <FileTextFilled className="icon" />,
      path: '/home/todoL-lists'
    },
    {
      title: 'Reminder',
      total: '0',
      Icon: <AlertFilled className="icon" />,
      path: '/home/reminders'
    },
  ])

  useEffect(() => {
    if (isInit.current) return

    isInit.current = true

    serviceGetPanelData()
    .then(res => {
      const data = state.slice()
      data[0].total = Number(res.consumption).toFixed(2)
      data[1].total = res.todayTaskCount.toString()
      data[2].total = res.unfinishedTodoListCount.toString()
      data[3].total = res.reminderCount.toString()
      setState(data)
    })
  }, [state])

  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24}} className="panel-group">
      {state.map(item => (
        <Col xl={6} lg={12} md={12} sm={24} xs={24} key={item.title}>
          <Link to={item.path} className="block-item">
            {item.Icon}
            <div className="data">
              <Statistic title={item.title} value={item.total} suffix={item.suffix} />
            </div>
          </Link>
        </Col>
      ))}
    </Row>
  )
}

export default React.memo(PanelGroup)
