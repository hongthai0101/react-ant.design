import React, { useState, useEffect } from 'react'
import './style.scss'
import config from '@/config'
import { LeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { LOG_LIST } from './constants'
import { Form, Input, Button, Select } from 'antd'
import { filterOption } from '@/utils'
import { serviceCreateLog, serviceUpdateLog, serviceGetLogById } from '@/services/log'
import { LOCAL_STORAGE } from '@/constants'
import { getAllCompany } from '@/store/companySlice'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { ICompany } from '@/models/company'
import { ILog } from '@/models'

const { TextArea } = Input
const { Option } = Select

const DEF_COMPANY_ID = localStorage.getItem(
  LOCAL_STORAGE.COMPANY_ID
) || '-1'

const CreateLogPage: React.FC = function() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const params = useParams()
  const { id } = params
  const isEdit = !!id

  const [typeRecord, setTypeRecord] = useState<Record<string, any>>({})
  const companies: Pick<ICompany, 'id' | 'name'>[] = useAppSelector(state => ([
    {
      name: 'Without',
      id: '-1'
    },
    ...state.company.companyAll
  ]));  

  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<ILog>()
  const dispatch = useAppDispatch()
  const type = params.type || detail?.logType

  function goBack() {
    navigate('/home/logs', { replace: true })
  }

  async function handleSubmitForm() {
    try {
      const values: Partial<ILog> = await form.validateFields()
      const params: Partial<ILog> = {
        logType: Number(type),
        ...detail,
        doneContent: values.doneContent,
        undoneContent: values.undoneContent,
        planContent: values.planContent,
        summaryContent: values.summaryContent,
        company: values.companyId
      }

      setLoading(true)
      localStorage.setItem(LOCAL_STORAGE.COMPANY_ID, params.company as string)
      const httpService = isEdit ? serviceUpdateLog : serviceCreateLog

      httpService(params).then(() => {
        goBack()
      }).finally(() => {
        setLoading(false)
      })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (isEdit) {
      serviceGetLogById(id).then(res => {
        setDetail(detail)
        form.setFieldsValue({
          companyId: res.companyId,
          doneContent: res.doneContent,
          undoneContent: res.undoneContent,
          planContent: res.planContent,
          summaryContent: res.summaryContent
        })
      })
    }

    return () => form.setFieldsValue({})
  }, [isEdit])

  useEffect(() => {
    if (type) {
      const res = LOG_LIST.find(item => Number(item.key) === Number(type))
      if (res) {
        setTypeRecord(res!)
        document.title = `Create${res!.name} - ${config.title}`
      }
    }

    return () => {
      document.title = '';
    }
  }, [type])

  useEffect(() => {
    dispatch(getAllCompany())
  }, [])

  return (
    <section className="createlog-page">
      <div className="top">
        <LeftOutlined className="icon-arrow" onClick={goBack} />
        <h1 className="title">{typeRecord.name}</h1>
        <div></div>
      </div>

      <Form form={form} preserve={false} layout="vertical">
        <Form.Item
          name="companyId"
          label="Company"
          initialValue={detail?.companyId ?? DEF_COMPANY_ID}
          rules={[
            {
              required: true
            }
          ]}
        >
          <Select filterOption={filterOption} showSearch>
            {companies.map(item => (
              <Option key={item.id} value={item.id}>{item.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="doneContent"
          label={typeRecord.doneTitle}
          rules={[
            {
              required: true
            }
          ]}
        >
          <TextArea
            rows={4}
            maxLength={1200}
            placeholder="Please enter"
            showCount
          />
        </Form.Item>

        <Form.Item
          name="undoneContent"
          label={typeRecord.undoneTitle}
        >
          <TextArea
            rows={4}
            maxLength={1200}
            placeholder="Please enter"
            showCount
          />
        </Form.Item>

        <Form.Item
          name="planContent"
          label={typeRecord.planTitle}
          rules={[
            {
              required: true
            }
          ]}
        >
          <TextArea
            rows={4}
            maxLength={1200}
            placeholder="Please enter"
            showCount
          />
        </Form.Item>

        <Form.Item
          name="summaryContent"
          label={typeRecord.summaryTitle}
        >
          <TextArea
            rows={4}
            maxLength={1200}
            placeholder="Please enter"
            showCount
          />
        </Form.Item>
      </Form>

      <div className="footbar">
        <Button onClick={goBack}>Back</Button>
        <Button onClick={handleSubmitForm} type="primary" loading={loading}>Submit</Button>
      </div>
    </section>
  )
}

export default CreateLogPage
