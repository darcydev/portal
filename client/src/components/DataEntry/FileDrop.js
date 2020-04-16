import React, { useContext } from 'react';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import AuthContext from '../../context/auth-context';

export default function FileDrop() {
  const AUTH_CONTEXT = useContext(AuthContext);

  const handleUpload = (fileList) => {
    if (!fileList) return;

    console.log('fileList :', fileList);

    fileList.map((file, i) => {
      if (file.status !== 'done') return;

      const fileName = file.name;
      const fileId = file.uid;
      const fileType = fileName.split('.')[1];

      console.log('fileType', fileType);

      // TODO send to backend
    });
  };

  return (
    <Upload.Dragger
      name='file'
      multiple={true}
      action='http://localhost:8000/api/s3/upload'
      onChange={(info) => handleUpload(info.fileList)}
    >
      <p className='ant-upload-drag-icon'>
        <InboxOutlined />
      </p>
      <p className='ant-upload-text'>
        Click or drag file to this area to upload
      </p>
      <p className='ant-upload-hint'>Support for a single or bulk upload.</p>
    </Upload.Dragger>
  );
}
