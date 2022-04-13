import React, { useEffect } from 'react'
import moment from 'moment'
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber
} from 'antd'
import { serviceCreateCapitalFlow, serviceUpdateCapitalFlow } from '@/services'
import useKeepState from 'use-keep-state'
import { filterOption, FORMAT_DATETIME } from '@/utils'
import { formLayoutItem } from '@/utils'

const { TextArea } = Input
const { Option } = Select

type Props = {
  visible: boolean
  onCancel: () => void
  onSuccess: (res?: any) => void
  rowData?: Record<string, any>
  nameList: any[]
}

interface State {
  confirmLoading: boolean
}

const initialState: State = {
  confirmLoading: false,
}

const CreateCapitalFlowModal: React.FC<Props> = function ({
  visible,
  onCancel,
  onSuccess,
  rowData,
  nameList
}) {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)

  async function handleSubmit() {
    try {
      const values = await form.validateFields()
      const params = {
        date: values.date.format(FORMAT_DATETIME),
        remark: values.remark?.trim() ?? '',
        typeId: values.typeId,
        price: Number(values.amount)
      }

      setState({ confirmLoading: true });

      (
        !rowData
          ? serviceCreateCapitalFlow(params)
          : serviceUpdateCapitalFlow(rowData.id, params)
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
        date: moment(rowData.createdAt),
        remark: rowData.remark,
        typeId: rowData.typeId,
        amount: rowData.price,
      })
    }
  }, [visible, rowData])

  return (
    <Modal
      title="Create"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={state.confirmLoading}
      destroyOnClose
    >
      <Form form={form} preserve={false} {...formLayoutItem(4)}>
        <Form.Item
          label="Time"
          name="date"
          rules={[
            {
              required: true
            }
          ]}
        >
          <DatePicker
            showTime
            allowClear={false}
            className="w100"
          />
        </Form.Item>

        <Form.Item
          label="Category"
          name="typeId"
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
            {nameList.map((item: any) => (
              <Option value={item.id} key={item.id}>{item.optionName}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            {
              required: true
            }
          ]}
        >
          <InputNumber
            className="w100"
            placeholder="Please enter the amount"
            formatter={value => `￥ ${value}`}
            max={9999999}
            min={0}
            precision={2}
          />
        </Form.Item>

        <Form.Item
          label="Remark"
          name="remark"
        >
          <TextArea
            rows={5}
            maxLength={250}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CreateCapitalFlowModal)
