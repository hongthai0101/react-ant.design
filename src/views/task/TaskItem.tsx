import React, { useMemo } from 'react'
import './style.scss'
import { serviceDeleteTask, serviceUpdateTask } from '@/services'
import {
  Card,
  Button,
  Rate,
  Popconfirm,
  Image,
  Row, Col
} from 'antd'
import { formatDateTime } from '@/utils'
import { IImage, ITask } from '@/models'

interface Props {
  data: ITask,
  reloadData(): void
}

const TaskItem: React.FC<Props> = ({ data, reloadData }) => {

  const { id, images, content, count, createdAt, type } = data;

  function handleAction(buttonType: number) {
    if (buttonType === 0) {
      serviceDeleteTask(id)
        .then(() => {
          reloadData()
        })
    } else {
      serviceUpdateTask(id, {
        rollback: buttonType === 2 && true
      })
        .then(() => {
          reloadData()
        })
    }
  }

  const showImage = useMemo(() => (
    <Row gutter={16}>
      {images && images.map((image: IImage, index: number) => (
        <Col className="gutter-row" span={6} key={index}>
          <Image
            width={80}
            src={image.url}
            alt={image.name}
          />
        </Col>
      ))}
    </Row>
  ), [])

  return (
    <Card
      title="My to do"
      hoverable
      className="task-component"
    >
      <p className="content">{content}</p>
      <div className="level">
        <span>Priority: </span>
        <Rate value={count} disabled></Rate>
        <p className="mt10">
          Image:
        </p>
        {showImage}
        <p className="mt10">
          Created At: {formatDateTime(createdAt)}
        </p>
      </div>

      <div className="button-wrapper">
        <Popconfirm
          title="Are you sure you want to delete it?"
          onConfirm={handleAction.bind(null, 0)}
          placement="bottomLeft"
          okType="danger"
        >
          <Button
            type="primary"
            danger
            size="small"
          >
            Delete
          </Button>
        </Popconfirm>

        {(type === 1) && (
          <Button
            type="primary"
            size="small"
            onClick={handleAction.bind(null, 1)}
          >
            Start
          </Button>
        )}
        {([2, 3].includes(type)) && (
          <Button
            type="primary"
            size="small"
            onClick={handleAction.bind(null, 2)}
          >
            Go back
          </Button>
        )}
        {(type === 2) && (
          <Button
            type="primary"
            size="small"
            onClick={handleAction.bind(null, 1)}
          >
            Finish
          </Button>
        )}
      </div>
    </Card>
  )
}

export default React.memo(TaskItem)
