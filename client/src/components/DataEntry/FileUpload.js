import React from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

export default function FileUpload() {
  return (
    <Upload.Dragger {...props}>
      <p className='ant-upload-drag-icon'>
        <InboxOutlined />
      </p>
      <p className='ant-upload-text'>
        Click or drag file to this area to upload
      </p>
      <p className='ant-upload-hint'>
        Support for a single or bulk upload. Strictly prohibit from uploading
        company data or other band files
      </p>
    </Upload.Dragger>
  );
}

const props = {
  name: 'file-upload',
  multiple: true,
  action: 'http://localhost:8000/api/s3/upload',
  onChange(info) {
    const { response, status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      if (response.error) {
        message.error(
          `${info.file.name} file upload failed: ${response.error.name}: ${response.error.message}`
        );
      } else {
        message.success(`${info.file.name} file uploaded successfully.`);
      }
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
