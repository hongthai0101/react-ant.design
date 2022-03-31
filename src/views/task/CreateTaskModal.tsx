import React, { useState } from 'react'
import useKeepState from 'use-keep-state'
import { isBefore, formatDateTime } from '@/utils'
import { serviceCreateTask } from '@/services'
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Rate
} from 'antd'
import { MultiUpload } from '@/components/upload';
import { formLayoutItem } from '@/utils'
import { IImage, ITask } from '@/models'

type Props = {
  visible: boolean
  data?: ITask
  onSuccess(): void
  onCancel(): void
}

const { TextArea } = Input
const initialState = {
  confirmLoading: false,
}

const CreateTaskModal: React.FC<Props> = function ({
  visible,
  onSuccess,
  onCancel,
}) {
  const [form] = Form.useForm();
  const [state, setState] = useKeepState(initialState);
  const [ images, setImages ] = useState<IImage[]>([]);

  async function handleSubmitForm() {
    try {
      const values = await form.validateFields()
      const params: Partial<ITask> = {
        date: formatDateTime(values.date),
        content: values.content.trim(),
        count: values.count,
        images
      }

      setState({ confirmLoading: true })

      serviceCreateTask(params)
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

  const handleUploadSuccess = (images: IImage[]) => setImages(images);

  return (
    <Modal
      title="Create"
      visible={visible}
      onOk={handleSubmitForm}
      onCancel={onCancel}
      confirmLoading={state.confirmLoading}
      destroyOnClose
    >
      <Form form={form} preserve={false} {...formLayoutItem(5)}>
        <Form.Item
          label="Date"
          name="date"
          rules={[
            {
              required: true
            }
          ]}
        >
          <DatePicker
            allowClear={false}
            disabledDate={isBefore}
            className="w100"
          />
        </Form.Item>

        <Form.Item
          label="Content"
          name="content"
          rules={[
            {
              required: true
            }
          ]}
        >
          <TextArea
            rows={3}
            maxLength={200}
            placeholder="Please enter content"
          />
        </Form.Item>

        <Form.Item
          label="Priority"
          name="count"
          initialValue={5}
          rules={[
            {
              required: true
            }
          ]}
        >
          <Rate />
        </Form.Item>
        <Form.Item
          label="Image"
        >
          <MultiUpload onSuccess={handleUploadSuccess} maxFile={4} previewVisible={false}  previewImage='' previewTitle='' fileList={[]} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CreateTaskModal)
