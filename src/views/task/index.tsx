import React, { useEffect } from 'react'
import './style.scss'
import useKeepState from 'use-keep-state'
import NoData from '@/components/no-data/index'
import TaskItem from './TaskItem'
import CreateTaskModal from './CreateTaskModal'
import moment from 'moment'
import { DatePicker, Button, Tag, Row, Col, Form } from 'antd'
import { serviceGetTask } from '@/services'
import { FORMAT_DATE, FORMAT_DATETIME } from '@/utils'
import { ITask, TaskProp } from '@/models'

const TASK_TYPE: {
  [key: string]: TaskProp
} = {
  wait: { text: 'Pending', color: 'orange' },
  process: { text: 'Working', color: '#108ee9' },
  finished: { text: 'Completed', color: '#87d068' },
  unfinished: { text: 'Undone', color: '#f50' }
}

interface State {
  data: {
    wait: TaskProp[]
    process: TaskProp[]
    finished: TaskProp[]
    unfinished: TaskProp[]
  }
  showCreateTaskModal: boolean
}

const initialState: State = {
  data: {
    wait: [],
    process: [],
    finished: [],
    unfinished: []
  },
  showCreateTaskModal: false
}

const TodayTaskPage = () => {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)

  function getTask() {
    const values = form.getFieldsValue()
    const date = values.startDate.format(FORMAT_DATE)
    serviceGetTask({
      startDate: moment(date).startOf('D').format(FORMAT_DATETIME).toString(),
      endDate: moment(date).endOf('D').format(FORMAT_DATETIME).toString()
    })
    .then(res => {
      setState({ data: res })
    })
  }

  function initParams() {
    form.setFieldsValue({
      startDate: moment()
    })
    getTask()
  }

  function toggleCreateTaskModal() {
    setState({ showCreateTaskModal: !state.showCreateTaskModal })
  }

  function handleSuccess() {
    toggleCreateTaskModal()
    getTask()
  }

  function handlePrevDay() {
    const startDate: moment.Moment = form.getFieldValue('startDate')
    form.setFieldsValue({
      startDate: moment(
        startDate.subtract(1, 'day').format(FORMAT_DATE)
      )
    })
    getTask()
  }

  function handleNextDay() {
    const startDate: moment.Moment = form.getFieldValue('startDate')
    form.setFieldsValue({
      startDate: moment(
        startDate.add(1, 'day').format(FORMAT_DATE)
      )
    })
    getTask()
  }

  useEffect(() => {
    initParams()
  }, [])

  return (
    <div className="today-task">
      <div className="query-panel">
        <Form
          form={form}
          layout="inline"
          onValuesChange={getTask}
        >
          <Form.Item name="startDate" label="Query date">
            <DatePicker allowClear={false} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={getTask}>Inquire</Button>
            <Button onClick={handlePrevDay}>The day before</Button>
            <Button onClick={handleNextDay}>The day after</Button>
            <Button onClick={toggleCreateTaskModal}>Create</Button>
            <Button onClick={initParams}>Reset</Button>
          </Form.Item>
        </Form>
      </div>

      <div className="wrapper">
        {(
          state.data.wait.length > 0 ||
          state.data.process.length > 0 ||
          state.data.finished.length > 0 ||
          state.data.unfinished.length > 0
        ) ? (
          <Row gutter={24}>
            {Object.keys(state.data).map((key: string) => (
              <Col span={6} key={key}>
                <div className="tac">
                  <Tag color={TASK_TYPE[key].color}>{TASK_TYPE[key].text}</Tag>
                </div>
                {state.data[key].map((item: ITask) => (
                  <TaskItem key={item.id} data={item} reloadData={getTask} />
                ))}
              </Col>
            ))}
          </Row>
        ) : (
          <NoData
            message="Don't have a to-do yet, do you want to create it now?"
            onClick={toggleCreateTaskModal}
          />
        )}
      </div>

      <CreateTaskModal
        visible={state.showCreateTaskModal}
        onSuccess={handleSuccess}
        onCancel={toggleCreateTaskModal}
      />
    </div>
  )
}

export default TodayTaskPage
