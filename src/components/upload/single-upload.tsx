import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useMemo, useState } from 'react';
import { UploadChangeParam } from 'antd/lib/upload';
import CONFIG from '@/config';

function getBase64(img: any, callback: (imageUrl: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);  
}

function beforeUpload(file: any) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

type SingleUploadProps = {
  imageUrl: string,
  onSuccess: (imageUrl: string) => void
}

const SingleUpload: React.FC<SingleUploadProps> = props => {
  const {onSuccess} = props;
  
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(props.imageUrl);

  const handleChange = useMemo( () => (info: UploadChangeParam) => {    
    if (info.file.status === 'uploading') setLoading(true);

    if (info.file.status === 'done') {
      const response = info.fileList.pop()
        getBase64(info.file.originFileObj, (imageUrl: string) => {
          setLoading(false);
          setImageUrl(imageUrl);
          onSuccess(response?.response?.data as string)
        }
      );
    }

    if (info.file.status === 'error') {
      setLoading(true);
      message.error('Upload image error');
    }
  }, []);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Upload
      name="image"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action={CONFIG.upload.url as string}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      headers={{
        "accept": "application/json",
        apikey: CONFIG.upload.apiKey as string
      }}
    >
      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  );

}
export default SingleUpload;