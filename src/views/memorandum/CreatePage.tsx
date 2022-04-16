// https://ui.toast.com/tui-editor/
import React, { useState, useEffect } from 'react'
import './style.scss'
import Editor from '@toast-ui/editor'
import { Input, Button, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { defaultTitle } from './constants'
import {
  serviceCreateMemorandum,
  serviceGetMemorandumById,
  serviceUpdateMemorandum
} from '@/services'

let editor: Editor

const CreatePage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [title, setTitle] = useState(defaultTitle)
  const [loading, setLoading] = useState(false)

  function goBack() {
    navigate('/home/memorandums', { replace: true })
  }

  function handleSubmit() {
    if (loading) return

    const params = {
      markdown: editor.getMarkdown(),
      title
    }
    if (!params.markdown) {
      message.warn('Entity content cannot be empty')
      return
    }

    setLoading(true);

    (id ? serviceUpdateMemorandum(id, params) : serviceCreateMemorandum(params))
      .then(() => {
        navigate('/home/memorandums', { replace: true })
      })
      .catch(() => {
        setLoading(false)
      })
  }

  function init() {
    editor = new Editor({
      el: document.querySelector('#edit-section') as HTMLDivElement,
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      usageStatistics: false
    })

    if (id) {
      setLoading(true)
      serviceGetMemorandumById(id)
        .then(res => {
          setTitle(res.title)
          editor.setMarkdown(res.markdown)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  useEffect(() => {
    init()

    return () => {
      editor?.destroy()
    }
  }, [])

  return (
    <div className="editor-page">
      <Input
        className="input-title"
        placeholder={defaultTitle}
        maxLength={50}
        size="large"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onBlur={() => (!title && setTitle(defaultTitle))}
      />
      <div id="edit-section"></div>
      <div className="button-group">
        <Button onClick={goBack}>Cancel</Button>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

export default CreatePage
