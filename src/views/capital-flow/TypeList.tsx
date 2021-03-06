import React, { useEffect } from 'react'
import './style.scss'
import moment from 'moment'
import useKeepState from 'use-keep-state'
import CreateTypeModal from './CreateTypeModal'
import { Table, Button, Tag, Popconfirm } from 'antd'
import {
  serviceGetCapitalFlowType,
  serviceDeleteCapitalFlowType
} from '@/services'
import { TypeNames, TypeColors } from './enum'
import { FORMAT_DATE_MINUTE } from '@/utils'
import { ICapitalFlowType } from '@/models'

const initialState = {
  showCreateTypeModal: false,
  selectedRowKeys: [],
  loading: false,
  data: [],
  rowData: null
}

const Type = () => {
  const [state, setState] = useKeepState(initialState)
  const tableColumns = [
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Category',
      render: (rowData: ICapitalFlowType) => (
        <Tag color={rowData.color}>{rowData.typeName}</Tag>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt'
    },
    {
      title: 'Operate',
      render: (rowData: ICapitalFlowType) => (
        <Button onClick={handleEdit.bind(null, rowData)}>Edit</Button>
      )
    },
  ]

  function getCapitalFlowType() {
    serviceGetCapitalFlowType()
      .then(res => {
        const handleData = res.items.map((item: ICapitalFlowType) => {
          item.typeName = TypeNames[item.type]
          item.color = TypeColors[item.type]
          item.createdAt = moment(item.createdAt).format(FORMAT_DATE_MINUTE)
          return item
        })
        setState({ data: handleData })
      })
  }

  function deleteCapitalFlowType() {
    const ids = state.selectedRowKeys.join()
    if (!ids) return

    setState({ loading: true })
    serviceDeleteCapitalFlowType(ids)
      .then(() => {
        getCapitalFlowType()
      })
      .finally(() => {
        setState({ loading: false })
      })
  }

  function handleOnSuccess() {
    setState({ showCreateTypeModal: false })
    getCapitalFlowType()
  }

  function handleAdd() {
    setState({
      showCreateTypeModal: true,
      rowData: null
    })
  }

  function handleEdit(rowData: ICapitalFlowType) {
    setState({
      showCreateTypeModal: true,
      rowData
    })
  }

  useEffect(() => {
    getCapitalFlowType()
  }, [])

  const rowSelection = {    
    selectedRowKeys: state.selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setState({ selectedRowKeys })
    }
  }

  return (
    <div className="capital-flow-type">
      <div className="button-group">
        <Popconfirm
          title="Are you sure you want to delete it?"
          onConfirm={deleteCapitalFlowType}
          placement="bottomLeft"
          okType="danger"
        >
          <Button type="primary" danger>Delete</Button>
        </Popconfirm>
        <Button type="primary" onClick={handleAdd}>Create</Button>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={tableColumns}
        dataSource={state.data}
        pagination={false}
        rowKey="id"
        loading={state.loading}
      />

      <CreateTypeModal
        visible={state.showCreateTypeModal}
        rowData={state.rowData}
        onCancel={() => setState({ showCreateTypeModal: false })}
        onSuccess={handleOnSuccess}
      />
    </div>
  )
}

export default Type
