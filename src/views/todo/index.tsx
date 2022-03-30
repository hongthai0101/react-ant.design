import React, { useEffect, useRef } from 'react'
import useKeepState from 'use-keep-state'
import Table from '@/components/table'
import CreateTodoModal from './CreateTodoModal'
import { serviceGetTodoList, serviceDeleteTodoList, serviceUpdateTodoList } from '@/services'
import { STATUS } from './constants'
import { DatePicker, Button, Tag, Form, Popconfirm } from 'antd'
import { FORMAT_DATE, formatDateMinute, DATE_YEAR } from '@/utils'
import { ITodoGetList, ITodoList } from '@/models'

const { RangePicker } = DatePicker

interface State {
  showCreateTodoModal: boolean
  currentRowData: ITodoList | null
}

const initState: State = {
  showCreateTodoModal: false,
  currentRowData: null
}

const TodoListPage = () => {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initState)
  const tableRef = useRef<any>()
  const tableColumns = [
    {
      title: 'Status',
      dataIndex: 'status',
      width: 90,
      render: (status: number) => (
        <Tag color={STATUS[status].color}>
          {STATUS[status].text}
        </Tag>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      width: 170
    },
    {
      title: 'Content',
      dataIndex: 'content',
      className: 'wbba wpr'
    },
    {
      title: 'Operate',
      width: 250,
      align: 'right',
      fixed: 'right',
      render: (row: ITodoList) => (
        row.status !== 2 &&
        (<>
          <Button onClick={() => handleActionButton(0, row)}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete it?"
            onConfirm={() => handleActionButton(1, row)}
            placement="bottomLeft"
            okType="danger"
          >
            <Button>Delete</Button>
          </Popconfirm>
          <Button
            onClick={() => handleActionButton(2, row)}
            disabled={row.status === 2}
          >
            Finish
          </Button>
        </>)
      )
    }
  ]

  function getData() {
    tableRef.current.getTableData()
  }

  function getTodoList(params: ITodoGetList) {
    const values = form.getFieldsValue()

    if (values.date && values.date.length === 2) {
      params.startDate = values.date[0].format(FORMAT_DATE)
      params.endDate = values.date[1].format(FORMAT_DATE)
    }

    return serviceGetTodoList(params).then(res => {
      res.items.map(item => {
        item.createdAt = formatDateMinute(item.createdAt)
        return item
      })
      return res
    })
  }

  function initParams() {
    form.resetFields()
    tableRef?.current?.getTableData()
  }

  function toggleCreateTodoModal() {
    setState({ showCreateTodoModal: !state.showCreateTodoModal })
  }

  const handleSuccess = function () {
    toggleCreateTodoModal()
    tableRef.current.getTableData()
  }

  function handleActionButton(buttonType: number, row: ITodoList) {
    switch (buttonType) {
      case 0:
        setState({ showCreateTodoModal: true, currentRowData: row })
        break
      case 1:
        serviceDeleteTodoList(row.id)
          .then(res => {
            tableRef.current.getTableData()
          })
        break
      case 2:
        serviceUpdateTodoList(row.id, { status: 2 })
          .then(res => {
            tableRef.current.getTableData()
          })
        break
      default:
    }
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
          onValuesChange={() => tableRef?.current?.getTableData()}
        >
          <Form.Item name="date" label="Date" initialValue={DATE_YEAR}>
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
        getTableData={getTodoList}
        columns={tableColumns}
        onDelete={serviceDeleteTodoList}
        onAdd={() => setState({
          showCreateTodoModal: true,
          currentRowData: null
        })}
      />

      <CreateTodoModal
        visible={state.showCreateTodoModal}
        onSuccess={handleSuccess}
        onCancel={toggleCreateTodoModal}
        rowData={state.currentRowData}
      />
    </div>
  )
}

export default TodoListPage
