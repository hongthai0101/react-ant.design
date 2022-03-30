import React, { useEffect } from 'react'
import moment from 'moment'
import useKeepState from 'use-keep-state'
import {
  Modal,
  Form,
  Input,
  DatePicker
} from 'antd'
import { serviceCreateReminder, serviceUpdateReminder } from '@/services'
import { isBefore, formatDateTime, formLayoutItem } from '@/utils'
import { IReminder } from '@/models'

const { TextArea } = Input

type Props = {
  visible: boolean
  onCancel: () => void
  onSuccess: (res?: any) => void
  rowData?: IReminder
}

interface State {
  confirmLoading: boolean
}

const initialState: State = {
  confirmLoading: false
}

const CreateReminder: React.FC<Props> = function ({
  visible,
  rowData,
  onCancel,
  onSuccess,
}) {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)

  async function handleSubmitForm() {
    try {
      const values = await form.validateFields()
      const params: Partial<IReminder> = {
        date: formatDateTime(values.date),
        content: values.content.trim()
      }

      setState({ confirmLoading: true });

      (
        !rowData
          ? serviceCreateReminder(params)
          : serviceUpdateReminder(rowData.id, params)
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
        content: rowData.content
      })
    }
  }, [visible, rowData])

  return (
    <Modal
      title="Add New"
      visible={visible}
      onOk={handleSubmitForm}
      onCancel={onCancel}
      confirmLoading={state.confirmLoading}
      destroyOnClose
    >
      <Form form={form} preserve={false} {...formLayoutItem()} >
        <Form.Item
          name="date"
          label="Date"
          rules={[
            {
              required: true
            }
          ]}
        >
          <DatePicker
            showTime
            allowClear={false}
            disabledDate={isBefore}
            className="w100"
          />
        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
          rules={[
            {
              required: true
            }
          ]}
        >
          <TextArea
            rows={3}
            maxLength={200}
            placeholder="Content"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CreateReminder)
