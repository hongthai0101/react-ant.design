import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useMemo, useState } from 'react';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import CONFIG from '@/config';
import { IImage } from '@/models';

function getBase64(file: any) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

type MultiUploadProps = {
    previewVisible?: boolean,
    previewImage: string,
    previewTitle: string,
    fileList: UploadFile<unknown>[],
    maxFile: number
    onSuccess: (images: IImage[]) => void
}

const MultiUpload: React.FC<MultiUploadProps> = props => {
    const { maxFile, onSuccess } = props;

    const [previewVisible, setPreviewVisible] = useState(props.previewVisible);
    const [previewImage, setPreviewImage] = useState<string>(props.previewImage);
    const [previewTitle, setPreviewTitle] = useState<string>(props.previewTitle);
    const [fileList, setFileList] = useState<UploadFile<any>[]>(props.fileList);

    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewVisible(true);
        setPreviewImage(file.url || file.preview);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = (info: UploadChangeParam) => {
        const { status } = info.file;
        setFileList(info.fileList);
        if(status === 'done' || status === 'error') {            
            onSuccess(info.fileList.filter(el => el.status === 'done').map(el => ({name: el.response.name, url: el.response.url})));
        }
    };

    const uploadButton = useMemo(() => (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    ), [])

    return (
        <>
            <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {fileList.length >= maxFile ? null : uploadButton}
            </Upload>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
}

export default MultiUpload;