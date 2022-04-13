import React, { useEffect, useMemo, useRef } from 'react'
import useKeepState from 'use-keep-state'
import Table from '@/components/table'
import DetailDrawer from './DetailDrawer'
import {
  serviceDeleteLog,
  serviceGetLogList
} from '@/services/log'
import { DatePicker, Button, Select, Form, Popconfirm, Dropdown, Menu } from 'antd'
import { FORMAT_DATE, filterOption } from '@/utils'
import { DownOutlined } from '@ant-design/icons'
import { MenuInfo } from 'antd/node_modules/rc-menu/lib/interface'
import { LOG_LIST } from './constants'
import { useNavigate, Link } from 'react-router-dom'
import { getAllCompany } from '@/store/companySlice'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { ICompany } from '@/models/company'
import { ILog, ILogGetList } from '@/models'

const { RangePicker } = DatePicker
const { Option } = Select

interface State {
  companies: ICompany[]
  showDetailDrawer: boolean,
  detail: Record<string, any>
}

const initState: State = {
  companies: [],
  showDetailDrawer: false,
  detail: {}
}

const LogPage = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initState)
  const tableRef = useRef<any>()
  const dispatch = useAppDispatch()
  const companies = useAppSelector(state => ([
    {
      name: 'All',
      id: '-1'
    },
    ...state.company.companyAll
  ]))

  const tableColumns = [
    {
      title: 'Created At',
      dataIndex: '__createdAt__',
      width: 170
    },
    {
      title: 'Type',
      dataIndex: '__logType__',
      width: 170,
    },
    {
      title: 'Company',
      dataIndex: ['company','name'],
    },
    {
      title: 'Operate',
      width: 250,
      align: 'right',
      fixed: 'right',
      render: (row: ILog) => (
        <>
          <Button onClick={() => handlePreview(row)}>Details</Button>

          <Link to={`/home/logs/detail/${row.id}`}>
            <Button className="ml10">Edit</Button>
          </Link>

          <Popconfirm
            title="Are you sure you want to delete it?"
            placement="bottomLeft"
            okType="danger"
            onConfirm={() => handleDelLog(row.id)}
          >
            <Button>Delete</Button>
          </Popconfirm>
        </>
      )
    }
  ]

  function handlePreview(record: ILog) {
    setState({ detail: record })
    toggleDetailDrawer()
  }

  function handleDelLog(logId: string) {
    serviceDeleteLog(logId).then(() => {
      getData()
    })
  }

  function toggleDetailDrawer() {
    setState({ showDetailDrawer: !state.showDetailDrawer })
  }

  function getData() {
    tableRef.current.getTableData()
  }

  function getLogList(params: ILogGetList) {
    const values = form.getFieldsValue()

    if (values.date?.length === 2) {
      params.startDate = values.date[0].format(FORMAT_DATE)
      params.endDate = values.date[1].format(FORMAT_DATE)
    }
    params.company = values.company === '-1' ? null : values.company;    
    params.logType = values.logType === '-1' ? null : values.logType

    return serviceGetLogList(params)
  }

  function initParams() {
    form.resetFields()
    tableRef?.current?.getTableData()
  }

  useEffect(() => {
    initParams()
    dispatch(getAllCompany())
  }, [])

  function handleClickMenu({ key }: MenuInfo) {
    navigate(`/home/logs/create/${key}`)
  }

  const menu = (
    <Menu onClick={handleClickMenu}>
      {LOG_LIST.map(item => (
        <Menu.Item key={item.key}>{item.name}</Menu.Item>
      ))}
    </Menu>
  )

  const toolbar = useMemo(() => (
    <Dropdown overlay={menu}>
      <Button type="primary">
        Create
        <DownOutlined />
      </Button>
    </Dropdown>
  ), [])

  return (
    <div className="log-page">
      <div className="query-panel">
        <Form
          form={form}
          layout="inline"
          onValuesChange={() => tableRef?.current?.getTableData()}
        >
          <div className="w100">
            <div className="flex">
              <Form.Item name="company" label="Affiliated unit" initialValue="-1">
                <Select style={{ width: 200 }} showSearch filterOption={filterOption}>
                  {companies.map((item: Record<string, any>) => (
                    <Option key={item.id} value={item.id}>{item.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="date" label="Query date">
                <RangePicker allowClear />
              </Form.Item>

              <Form.Item>
                <Button type="primary" onClick={getData}>Inquire</Button>
                <Button onClick={initParams}>Reset</Button>
              </Form.Item>
            </div>
          </div>

          <div className="flex mt10">
            <Form.Item name="logType" label="Log type" initialValue="-1">
              <Select style={{ width: 200 }} showSearch filterOption={filterOption}>
                <Option value="-1">All</Option>
                {LOG_LIST.map((item: Record<string, any>) => (
                  <Option key={item.key} value={item.key}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </div>

      <Table
        ref={tableRef}
        getTableData={getLogList}
        columns={tableColumns}
        toolbar={toolbar}
        onDelete={serviceDeleteLog}
      />

      <DetailDrawer
        visible={state.showDetailDrawer}
        detail={state.detail}
        onClose={toggleDetailDrawer}
      />
    </div>
  )
}

export default LogPage
