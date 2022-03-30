import React, { FC, useEffect, useImperativeHandle } from 'react'
import './style.scss'
import { Table } from 'antd'
import { TableProps } from 'rc-table/lib/Table'
import { AxiosPromise } from 'axios'
import useKeepState from 'use-keep-state'
import Toolbar from './Toolbar'
import useDebounceFn from '@/hooks/useDebounceFn'

interface Props extends TableProps {
  getTableData: (data: any) => Promise<Record<string, any>>
  onTableChange?: (pagination: any, filters: any, sorter: any) => void
  onDelete?: (id: string) => AxiosPromise
  onAdd?: () => void
  toolbar?: React.ReactChild
  [key: string]: any
}

interface State {
  tableHeight: number
  tableDataSource: any[]
  isLoading: boolean
  pagination: Record<string, any>,
  selectedRowKeys: string[]
  columns: any[]
}

const DEFAULT_PAGE_SIZE = 50

const initialState: State = {
  tableHeight: 0,
  tableDataSource: [],
  isLoading: false,
  pagination: {
    pageNo: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    showSizeChanger: true,
    total: 0,
    pageSizeOptions: ['30', '50', '70', '100', '200']
  },
  selectedRowKeys: [],
  columns: []
}

function showTotal(total: number) {
  return `Shared ${total} strip`
}

const TableFC: FC<Props> = ({
  getTableData,
  onTableChange,
  onDelete,
  onAdd,
  forwardedRef: tableRef,
  columns,
  toolbar,
  ...props
}) => {
  let rowSelection
  const showRowSelection = onDelete
  const [state, setState] = useKeepState(initialState)


  console.log(1111);
  

  const { run: getData } = useDebounceFn(() => {
    setState({ isLoading: true })
    const { pageNo, pageSize } = tableRef.current
    getTableData({
      page: pageNo,
      limit: pageSize
    })
      .then(res => {
        setState({
          pagination: {
            ...state.pagination,
            total: res.total,
            pageSize
          },
          tableDataSource: res.rows
        })
      })
      .finally(() => {
        setState({ isLoading: false })
      })
  }, { wait: 500, leading: true })

  function onChange(pagination: any, filters: any, sorter: any) {
    const pageNo = pagination.current
    const pageSize = pagination.pageSize
    setState({
      pagination: {
        ...state.pagination,
        pageNo,
        pageSize
      }
    })
    tableRef.current.pageNo = pageNo
    tableRef.current.pageSize = pageSize
    onTableChange?.(pagination, filters, sorter)
    setTimeout(() => {
      getData()
    })
  }

  useEffect(() => {
    if (!tableRef.current) {
      tableRef.current = {}
    }
    tableRef.current.getTableData = getData
  })

  useEffect(() => {
    tableRef.current.pageNo = 1
    tableRef.current.pageSize = DEFAULT_PAGE_SIZE
  }, [tableRef])

  useEffect(() => {
    setTimeout(() => {
      const tableEl = document.querySelector('.ant-table-wrapper')
      if (tableEl) {
        setState({ tableHeight: tableEl.clientHeight - 120 })
      }
    }, 0)
  }, [])

  useEffect(() => {
    if (Array.isArray(columns)) {
      setState({
        columns: [
          {
            title: 'STT',
            width: 60,
            render: (_: any, $: any, i: number) => i + 1,
            align: 'center'
          }
        ].concat(columns as [])
      })
    }
  }, [columns])

  function handleDelete() {
    if (!onDelete) return null
    const selectedRowKeys = state.selectedRowKeys.join(',')
    onDelete(selectedRowKeys)
      .then(() => {
        setState({ selectedRowKeys: [] })
        getData()
      })
  }

  if (showRowSelection) {
    rowSelection = {
      onChange(selectedRowKeys: string[]) {
        setState({ selectedRowKeys })
      }
    }
  }

  return (
    <React.Fragment>
      <Toolbar
        selectedRowKeys={state.selectedRowKeys}
        toolbar={toolbar}
        onDelete={onDelete && handleDelete}
        onAdd={onAdd}
      />

      <Table
        {...props as any}
        rowKey="id"
        loading={state.isLoading}
        columns={state.columns}
        dataSource={state.tableDataSource}
        scroll={{ y: state.tableHeight + 'px', x: 1200 }}
        showHeader={state.tableDataSource.length}
        onChange={onChange}
        rowSelection={rowSelection}
        pagination={{
          ...state.pagination,
          size: 'small',
          showTotal
        }}
      />
    </React.Fragment>
  )
}

const forwardedTable = React.forwardRef((props: any, ref) => {
  return <TableFC {...props} forwardedRef={ref} />
});

export default React.memo(forwardedTable)
