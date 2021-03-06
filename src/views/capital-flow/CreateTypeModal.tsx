import React, { useEffect } from 'react'
import useKeepState from 'use-keep-state'
import {
  Modal,
  Form,
  Input,
  Select
} from 'antd'
import { serviceCreateCapitalFlowType, serviceUpdateCapitalFlowType } from '@/services'
import { TYPES } from './enum'
import { formLayoutItem, filterOption } from '@/utils'
import { ICapitalFlowType } from '@/models'

type Props = {
  visible: boolean
  onSuccess: (res?: any) => void
  onCancel: () => void
  rowData: null | ICapitalFlowType
}

const { Option } = Select
const initialState = {
  confirmLoading: false,
}

const CreateTypeModal: React.FC<Props> = function ({
  visible,
  rowData,
  onCancel,
  onSuccess
}) {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)

  async function handleSubmitForm() {
    try {
      const values = await form.validateFields()

      const params = {
        type: values.type,
        name: values.name.trim()
      }

      setState({ confirmLoading: true });

      (rowData
        ? serviceUpdateCapitalFlowType(rowData.id, params)
          : serviceCreateCapitalFlowType(params)
      )
      .then(res => {
        onSuccess(res)
      })
      .finally(() => {
        setState({ confirmLoading: false })
      })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (visible && rowData) {
      form.setFieldsValue({
        name: rowData.name,
        type: rowData.type
      })
    }
  }, [visible, rowData])

  return (
    <Modal
      title="Create"
      visible={visible}
      onOk={handleSubmitForm}
      onCancel={onCancel}
      confirmLoading={state.confirmLoading}
      destroyOnClose
    >
      <Form form={form} preserve={false} {...formLayoutItem(4)}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true
            }
          ]}
        >
          <Input
            maxLength={20}
            placeholder="Please enter a category name"
          />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[
            {
              required: true
            }
          ]}
        >
          <Select
            showSearch
            filterOption={filterOption}
          >
            {TYPES.map(item => (
              <Option value={item.value} key={item.value}>{item.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CreateTypeModal)
