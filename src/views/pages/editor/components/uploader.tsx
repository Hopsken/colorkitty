import React, { useCallback } from 'react'
import { Upload, Button, Icon } from 'antd'

interface Props {
  onSelectFile(file: File): void
}

export const Uploader: React.FC<Props> = (props) => {

  const handleUpload = useCallback((file: File) => {
    props.onSelectFile(file)
    return false
  }, [props.onSelectFile])

  return (
    <Upload.Dragger
      accept={'image/*'}
      beforeUpload={handleUpload}
      showUploadList={false}
      className='w-4/5 h-64'
    >
      <div className='flex flex-col justify-center'>
        <Icon type='inbox' className='mb-4 text-3xl' />
        <Button type='primary' className='w-3/6 mx-auto'>
          Browse or Drag Image Here
        </Button>
      </div>
    </Upload.Dragger>
  )
}
