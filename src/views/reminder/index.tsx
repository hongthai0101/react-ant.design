import React, { useEffect, useRef } from 'react'
import Table from '@/components/table'
import moment from 'moment'
import CreateReminder from './CreateReminder'
import useKeepState from 'use-keep-state'
import { connect } from 'react-redux'
import { DatePicker, Button, Select, Tag, Modal, Form, Popconfirm } from 'antd'
import { serviceGetReminder, serviceDeleteReminder } from '@/services'
import { FORMAT_DATE, formatDateTime } from '@/utils'
import { IReminder, IReminderGetList } from '@/models'
import { RootState } from '@/store'

const { RangePicker } = DatePicker
const Option = Select.Option
const STATUS_TYPE: Record<string, any> = {
  1: { color: '#f50', text: 'Reminded' },
  2: { color: '#87d068', text: 'Alerted' }
}

interface State {
  showCreateModal: boolean
  currentRow: IReminder | null
}

type Props = ReturnType<typeof mapStateToProps>

const initialState: State = {
  showCreateModal: false,
  currentRow: null
}

const ReminderPage: React.FC<Props> = function({ userInfo }) {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)
  const tableRef = useRef<any>()
  const tableColumns = [
    {
      title: 'Condition',
      dataIndex: 'type',
      width: 100,
      render: (row: number) => (
        <Tag color={STATUS_TYPE[row].color}>
          {STATUS_TYPE[row].text}
        </Tag>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      width: 220
    },
    {
      title: 'Content',
      dataIndex: 'content',
      className: 'wbba wpr'
    },
    {
      title: 'Operate',
      width: 180,
      align: 'right',
      fixed: 'right',
      render: (record: IReminder) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete it?"
            onConfirm={() => handleDelete(record)}
            placement="bottomLeft"
            okType="danger"
          >
            <Button>Delete</Button>
          </Popconfirm>
        </>
      )
    }
  ]

  const initParams = function() {
    const startDate = moment().startOf('year')
    const endDate = moment().endOf('year')
    form.setFieldsValue({
      queryType: '',
      date: [startDate, endDate]
    })
    tableRef?.current?.getTableData()
  }

  function getReminder(params: IReminderGetList) {
    const values = form.getFieldsValue()

    if (values.date && values.date.length === 2) {
      params.startDate = values.date[0].format(FORMAT_DATE)
      params.endDate = values.date[1].format(FORMAT_DATE)
    }

    if (values.queryType !== '') {
      params.type = values.queryType
    }

    return serviceGetReminder(params).then(res => {
      res.items = res.items.map((el: IReminder, idx: number) => {
        el.order = idx + 1
        el.createdAt = formatDateTime(el.createdAt)
        return el
      })
      return res
    })
  }

  function handleEdit(record: IReminder) {
    setState({
      showCreateModal: true,
      currentRow: record
    })
  }

  function handleDelete(record: IReminder) {
    serviceDeleteReminder(record.id)
      .then(() => {
        tableRef.current.getTableData()
      })
  }

  function handleCloseModal() {
    setState({ showCreateModal: false })
    tableRef.current.getTableData()
  }

  useEffect(() => {
    initParams()

    if (!userInfo.email) {
      Modal.warning({
        title: 'Your mailbox was not detected',
        content: (
          <>
           Please make your GitHub email public, otherwise it will affect the use of this function.
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to settings
            </a>
          </>
        ),
      })
    }
  }, [userInfo.email])

  return (
    <div className="reminder">
      <div className="query-panel">
        <Form
          form={form}
          layout="inline"
          onValuesChange={() => tableRef?.current?.getTableData()}
        >
          <Form.Item
            name="queryType"
            label="Query Type"
            initialValue=""
          >
            <Select>
              <Option value="">All</Option>
              <Option value="1">Reminded</Option>
              <Option value="2">Alerted</Option>
            </Select>
          </Form.Item>

          <Form.Item name="date" label="Date">
            <RangePicker allowClear />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={() => tableRef.current.getTableData()}>Refresh</Button>
            <Button onClick={initParams}>Reset</Button>
          </Form.Item>
        </Form>
      </div>

      <Table
        ref={tableRef}
        getTableData={getReminder}
        columns={tableColumns}
        onDelete={serviceDeleteReminder}
        onAdd={() => setState({ showCreateModal: true, currentRow: null })}
      />

      <CreateReminder
        visible={state.showCreateModal}
        rowData={state.currentRow}
        onCancel={handleCloseModal}
        onSuccess={handleCloseModal}
      />
    </div>
  )
}

const mapStateToProps = (store: RootState) => ({
  userInfo: store.user.userInfo
})

export default connect(mapStateToProps)(ReminderPage)
