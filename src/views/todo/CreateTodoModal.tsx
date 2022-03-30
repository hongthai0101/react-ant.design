import React from 'react'
import useKeepState from 'use-keep-state'
import { serviceCreateTodoList, serviceUpdateTodoList } from '@/services'
import {
  Modal,
  Form,
  Input
} from 'antd'
import { ITodoList } from '@/models'

type Props = {
  visible: boolean
  rowData: ITodoList | null
  onSuccess: () => void
  onCancel: () => void
}

const { TextArea } = Input
const initialState = {
  confirmLoading: false,
  content: '',
}

const CreateTodoModal: React.FC<Props> = function ({
  visible,
  onSuccess,
  onCancel,
  rowData
}) {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)

  async function handleSubmitForm() {
    try {
      setState({ confirmLoading: true })
      const values = await form.validateFields()
      const params: Partial<ITodoList> = {
        content: values.content.trim(),
      };

      (
        !rowData
          ? serviceCreateTodoList(params)
            : serviceUpdateTodoList(rowData.id, params)
      )
        .then(() => {
          onSuccess()
        })
        .finally(() => {
          setState({ confirmLoading: false })
        })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal
      title="Create"
      visible={visible}
      onOk={handleSubmitForm}
      onCancel={onCancel}
      confirmLoading={state.confirmLoading}
      destroyOnClose
    >
      <Form form={form} preserve={false}>
        <Form.Item
          label="Content"
          name="content"
          initialValue={rowData?.content}
          rules={[
            {
              required: true
            }
          ]}
        >
          <TextArea
            rows={6}
            value={state.content}
            onChange={e => setState({ content: e.target.value })}
            maxLength={250}
            placeholder="Please enter content"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CreateTodoModal)
