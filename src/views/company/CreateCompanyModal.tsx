import React from 'react'
import useKeepState from 'use-keep-state'
import {
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber
} from 'antd'
import { serviceCreateCompany, serviceUpdateCompany } from '@/services'
import { formatDate, formLayoutItem } from '@/utils'
import moment from 'moment'
import { ICompany } from '@/models/company'

const { TextArea } = Input

type Props = {
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
  detail: ICompany
}

interface State {
  confirmLoading: boolean
}

const initialState: State = {
  confirmLoading: false
}

const CreateCompanyModal: React.FC<Props> = function ({
  visible,
  detail,
  onCancel,
  onSuccess,
}) {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)

  const isEdit = detail.id
  const title = isEdit ? 'Editing' : 'Create'

  async function handleSubmitForm() {
    try {
      const values = await form.validateFields()
      const params: Partial<ICompany> = {
        name: values.name,
        startDate: formatDate(values.startDate),
        amount: Number(values.amount),
        remark: values.remark?.trim(),
      }

      if (values.endDate) {
        params.endDate = formatDate(values.endDate)
      }
      if (values.expectLeaveDate) {
        params.expectLeaveDate = formatDate(values.expectLeaveDate)
      }

      setState({ confirmLoading: true });

      (
        !isEdit
          ? serviceCreateCompany(params)
          : serviceUpdateCompany(detail.id, params)
      )
      .then(() => {
        onSuccess()
      })
      .finally(() => {
        setState({ confirmLoading: false })
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleSubmitForm}
      onCancel={onCancel}
      confirmLoading={state.confirmLoading}
      destroyOnClose
    >
      <Form form={form} preserve={false} {...formLayoutItem()}>
        <Form.Item
          name="name"
          label="Name"
          initialValue={detail.name}
          rules={[
            {
              required: true
            }
          ]}
        >
          <Input
            maxLength={200}
            placeholder="Please enter"
          />
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Start Date"
          initialValue={detail.startDate && moment(detail.startDate)}
          rules={[
            {
              required: true
            }
          ]}
        >
          <DatePicker allowClear={false} className="w100" />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="End Date"
          initialValue={detail.endDate && moment(detail.endDate)}
        >
          <DatePicker className="w100" />
        </Form.Item>

        <Form.Item
          name="expectLeaveDate"
          label="Expect Leave Date"
          initialValue={detail.expectLeaveDate && moment(detail.expectLeaveDate)}
        >
          <DatePicker className="w100" />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          initialValue={detail.amount}
          rules={[
            {
              required: true
            }
          ]}
        >
          <InputNumber min={1} max={99999999} className="w100" placeholder="Please enter" />
        </Form.Item>

        <Form.Item
          name="remark"
          label="Remark"
          initialValue={detail.remark ?? ''}
        >
          <TextArea
            rows={3}
            maxLength={200}
            placeholder="Please enter"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CreateCompanyModal)
