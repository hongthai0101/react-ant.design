import React, { useState, useEffect } from 'react'
import './style.scss'
import moment from 'moment'
import NoData from '@/components/no-data/index'
import { Card, Col, Row, Button, Popconfirm, Spin } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { serviceGetMemorandum, serviceDeleteMemorandum } from '@/services'
import { defaultTitle } from './constants'
import { IMemorandum } from '@/models'

const MemorandumPage: React.FC = () => {
  const navigate = useNavigate()
  const [list, setList] = useState<IMemorandum[]>([])
  const [loading, setLoading] = useState(true)

  function handleButton(
    buttonType: 0 | 1 | 2,
    item: IMemorandum | null,
    e?: React.MouseEvent
  ) {
    e?.stopPropagation()
    e?.preventDefault()

    if (buttonType === 0) {
      serviceDeleteMemorandum(item?.id)
      .then(() => {
        getData()
      })
      return
    }

    if (buttonType === 2) {
      navigate('/home/memorandums/create')
      return
    }

    navigate(`/home/memorandums/update/${item?.id}`)
  }

  function getData() {
    serviceGetMemorandum()
    .then(res => {
      const data = res.items.map((item: IMemorandum) => {
        item.createdAt = moment(item.createdAt).format('YYYY/M/D HH:mm')
        item.title = item.title || defaultTitle
        return item
      })
      setList(data)
    })
    .finally(() => setLoading(false))
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <Spin spinning={loading} wrapperClassName="memorandum-spin">
      <div className="memorandum">
        {(list.length > 0) ? (
          <Row gutter={16} align="bottom">
            {list.map((item: IMemorandum) => (
              <Col span={8} key={item.id}>
                <Link to={`/home/memorandums/detail/${item.id}`}>
                  <Card title={item.title} hoverable>
                    {item.createdAt}
                    <div
                      className="content"
                      dangerouslySetInnerHTML={{ __html: item.html }}
                    >
                    </div>
                    <div className="button-group">
                      <Popconfirm
                        title="Are you sure you want to delete it?"
                        onConfirm={e => {
                          e?.stopPropagation()
                          handleButton(0, item)
                        }}
                        placement="bottomLeft"
                        okType="danger"
                      >
                        <Button size="small">Delete</Button>
                      </Popconfirm>
                      <Button size="small" onClick={() => handleButton(1, item)}>Edit</Button>
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        ) : (
          <NoData
            message="Don't have a memo yet, would you like to create one now?"
            onClick={() => handleButton(2, null)}
          />
        )}
      </div>
    </Spin>
  )
}

export default MemorandumPage
