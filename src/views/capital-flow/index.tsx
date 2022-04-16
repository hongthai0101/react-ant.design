import React, { useEffect, useRef } from 'react'
import './style.scss'
import moment from 'moment'
import useKeepState from 'use-keep-state'
import Table from '@/components/table'
import CreateCapitalFlowModal from './CreateCapitalFlowModal'
import { DatePicker, Button, Select, Statistic, Input, Form, Popconfirm } from 'antd'
import {
  serviceGetCapitalFlow,
  serviceDeleteCapitalFlow,
  serviceGetCapitalFlowType,
  serviceGetCalculateFunds
} from '@/services'
import { OPTION_TYPES, TypeNames, TYPES } from './enum'
import { filterOption, FORMAT_DATE, FORMAT_DATE_MINUTE, isToDay } from '@/utils'
import { ICapitalFlow, ICapitalFlowGetList } from '@/models'

const { Search } = Input
const { RangePicker } = DatePicker
const Option = Select.Option

enum FilterType {
  Today = 1,
  Yesterday,
  LastWeek,
  ThisYear,
  PrevMonth,
  NextMonth
}

interface State {
  showCreateCapitalFlowModal: boolean
  currentRow: ICapitalFlow | null
  nameList: any[]
  price: {
    consumption: number
    income: number
    available: number
  }
  sortedInfo: any
  filters: object
}

const initialState: State = {
  showCreateCapitalFlowModal: false,
  currentRow: null,
  nameList: [],
  price: {
    consumption: 0,
    income: 0,
    available: 0
  },
  sortedInfo: null,
  filters: {}
}

const CapitalFlowPage: React.FC = function() {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)
  const tableRef = useRef<any>()

  const tableColumns = [
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      width: 180,
      sorter: true,
      sortOrder: state.sortedInfo?.field === 'createdAt' && state.sortedInfo.order,
      render: (text: string, rowData: any) => rowData.__createdAt__
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: 120
    },
    {
      title: 'Price',
      width: 140,
      sorter: true,
      dataIndex: 'price',
      sortOrder: state.sortedInfo?.field === 'price' && state.sortedInfo.order,
      filters: [
        {
          text: 'Hidden amount',
          value: false
        }
      ],
      render: (text: string, rowData: any) => (
        <span style={{ color: rowData.__color__ }}>
          {state.filters.price && !state.filters.price[0]
            ? '******'
            : rowData.__price__}
        </span>
      )
    },
    {
      title: 'Remarks',
      render: (rowData: any) => (
        <p className="wspw">{rowData.remark}</p>
      )
    },
    {
      title: 'Operate',
      width: 180,
      align: 'right',
      fixed: 'right',
      render: (row: any) => (
        <>
          <Button onClick={handleActionButton.bind(null, 0, row)}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete it?"
            onConfirm={handleActionButton.bind(null, 1, row)}
            placement="bottomLeft"
            okType="danger"
          >
            <Button>Delete</Button>
          </Popconfirm>
        </>
      )
    }
  ]

  function initParams(isGetData?: boolean) {
    const startDate = moment().startOf('month')
    const endDate = moment().endOf('month')
    setState({ sortedInfo: null })
    form.setFieldsValue({
      keyword: '',
      name: '',
      date: [startDate, endDate]
    })

    if (isGetData !== false) {
      tableRef.current.getTableData()
    }
  }

  async function getCapitalFlow(params: ICapitalFlowGetList) {
    try {
      const values = await form.validateFields()
      params = {
        ...params,
        keyword: values.keyword,
        typeName: values.name,
        type: values.type || null,
        startDate: values.date[0].format(FORMAT_DATE),
        endDate: values.date[1].format(FORMAT_DATE)
      }

      if (state.sortedInfo?.order) {
        params.sort = `${state.sortedInfo.field}-${state.sortedInfo.order.replace('end', '')}`
      }

      serviceGetCalculateFunds(params).then(res => {
        setState({
          price: {
            income: res.income,
            consumption: res.consumption,
            available: res.available
          }
        })
      });

      return serviceGetCapitalFlow(params).then(res => {
        res.items = res.items.map((el: ICapitalFlow, idx: number) => {
          const suffix = isToDay(el.createdAt) ? ' Today' : ''
          el.order = idx + 1
          el.__createdAt__ = moment(el.createdAt).format(FORMAT_DATE_MINUTE) + suffix
          el.__price__ = TYPES[ +el.type.type - 1].symbol + el.price
          el.__color__ = TYPES[ +el.type.type - 1].color

          return el
        })
        return res
      })



    } catch (error) {
      console.error(error)
    }
  }

  function getCapitalFlowType() {
    serviceGetCapitalFlowType()
      .then(res => {
        const data = res.items
          .map((item: any) => {
            item.optionName = `${TypeNames[item.type]} - ${item.name}`
            return item
          })
          .sort((a: any, b: any) => a.type - b.type)
        setState({ nameList: data })
      })
  }

  function handleActionButton(type: number, row: any) {
    if (type === 0) {
      setState({ showCreateCapitalFlowModal: true, currentRow: row })
    } else {
      serviceDeleteCapitalFlow(row.id).then(() => {
        tableRef.current.getTableData()
      })
    }
  }

  function onFilterDate(type: number) {
    const [startDate] = form.getFieldValue('date')
    const date: moment.Moment[] = [
      moment(moment().format(FORMAT_DATE), FORMAT_DATE),
      moment(moment().format(FORMAT_DATE), FORMAT_DATE)
    ]

    switch (type) {
      case FilterType.Yesterday:
        const prevDay = moment(
          moment()
            .subtract(1, 'days')
            .format(FORMAT_DATE), FORMAT_DATE
        )
        date[0] = prevDay
        date[1] = prevDay
        break

      case FilterType.LastWeek:
        date[0] = moment(
          moment()
            .subtract(7, 'days')
            .format(FORMAT_DATE),
          FORMAT_DATE
        )
        date[1] = moment(new Date(), FORMAT_DATE)
        break

      case FilterType.PrevMonth:
        date[0] = moment(
          moment(startDate)
            .subtract(1, 'month')
            .startOf('month')
            .format(FORMAT_DATE),
          FORMAT_DATE
        )
        date[1] = moment(
          moment(startDate)
            .subtract(1, 'month')
            .endOf('month')
            .format(FORMAT_DATE),
          FORMAT_DATE
        )
        break

      case FilterType.NextMonth:
        date[0] = moment(
          moment(startDate)
            .add(1, 'month')
            .startOf('month')
            .format(FORMAT_DATE),
          FORMAT_DATE
        )
        date[1] = moment(
          moment(startDate)
            .add(1, 'month')
            .endOf('month')
            .format(FORMAT_DATE),
          FORMAT_DATE
        )
        break

      case FilterType.ThisYear:
        date[0] = moment(
          moment(startDate)
            .startOf('year')
            .format(FORMAT_DATE),
          FORMAT_DATE
        )
        date[1] = moment(
          moment(startDate)
            .endOf('year')
            .format(FORMAT_DATE),
          FORMAT_DATE
        )
        break
    }

    form.setFieldsValue({ date })
    tableRef.current?.getTableData()
  }

  function onTableChange(_: unknown, filters: any, sorter: any) {
    setState({
      sortedInfo: {
        field: sorter.field,
        order: sorter.order
      },
      filters
    })
  }

  function handleModalOnSuccess() {
    setState({ showCreateCapitalFlowModal: false })
    tableRef.current.getTableData()
  }

  useEffect(() => {
    initParams(false)
    getCapitalFlowType()
  }, [])

  useEffect(() => {
    const date = form.getFieldValue('date')
    if (date.length <= 0) return
    tableRef?.current?.getTableData()
  }, [])

  return (
    <div className="capital-flow">
      <div className="query-panel">
        <Form form={form} layout="inline">
          <Form.Item
            label="Name"
            name="name"
            initialValue=""
          >
            <Select
              className="w150px"
              showSearch
              filterOption={filterOption}
            >
              <Option value="">All</Option>
              {state.nameList.map((item: any) => (
                <Option value={item.id} key={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>

          {!form.getFieldValue('name') && (
            <Form.Item
              label="Type"
              name="type"
              initialValue=""
            >
              <Select
                className="w150px"
                showSearch
                filterOption={filterOption}
              >
                {OPTION_TYPES.map(item => (
                  <Option value={item.value} key={item.value}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            label=""
            name="keyword"
            initialValue=""
          >
            <Search
              placeholder="Try searching for notes"
              maxLength={300}
              onSearch={() => tableRef.current.getTableData()}
              style={{ width: 260 }}
            />
          </Form.Item>

          <Button type="primary" onClick={tableRef.current?.getTableData}>Inquire</Button>
          <Button onClick={() => initParams()}>Reset</Button>
        </Form>

        <Form
          form={form}
          layout="inline"
          className="mt10"
          onValuesChange={() => tableRef?.current?.getTableData()}
        >
          <Form.Item
            label="Date"
            name="date"
            initialValue={[]}
          >
            <RangePicker />
          </Form.Item>

          <Button onClick={() => onFilterDate(FilterType.Today)}>Today</Button>
          <Button onClick={() => onFilterDate(FilterType.Yesterday)}>Yesterday</Button>
          <Button onClick={() => onFilterDate(FilterType.LastWeek)}>LastWeek</Button>
          <Button onClick={() => onFilterDate(FilterType.ThisYear)}>This Year</Button>
          <Button onClick={() => onFilterDate(FilterType.PrevMonth)}>Prev Month</Button>
          <Button onClick={() => onFilterDate(FilterType.NextMonth)}>Next Month</Button>
        </Form>

        <div className="poly">
          <div className="item-price">
            <em>Income: </em>
            <Statistic value={state.price.income} precision={2} />
          </div>
          <div className="item-price">
            <em>Expenses：￥</em>
            <Statistic value={state.price.consumption} precision={2} />
          </div>
          <div className="item-price">
            <em>Actual income: ￥</em>
            <Statistic value={state.price.available} precision={2} />
          </div>
        </div>
      </div>

      <Table
        ref={tableRef}
        getTableData={getCapitalFlow}
        columns={tableColumns}
        onTableChange={onTableChange}
        onDelete={serviceDeleteCapitalFlow}
        onAdd={() => setState({ showCreateCapitalFlowModal: true, currentRow: null })}
      />

      <CreateCapitalFlowModal
        visible={state.showCreateCapitalFlowModal}
        rowData={state.currentRow}
        nameList={state.nameList}
        onCancel={() => setState({ showCreateCapitalFlowModal: false })}
        onSuccess={handleModalOnSuccess}
      />
    </div>
  )
}

export default CapitalFlowPage
