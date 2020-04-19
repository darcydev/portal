import React, { useContext } from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import AuthContext from '../../context/auth-context';

export default function FileUpload() {
  const AUTH_CONTEXT = useContext(AuthContext);

  const uploadFileToMongoDB = async (name, url) => {
    const requestBody = {
      query: `
			mutation {
				uploadFile(fileInput: {name: "${name}", url: "${url}"}) {
					_id
					name
					url
				}
			}`,
    };

    const res = await fetch('http://localhost:8000/api/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_CONTEXT.token}`,
      },
    });

    res
      .json()
      .then((resData) => {
        console.log('resData :', resData);

        resData.data.uploadFile
          ? message.success(
              `${resData.data.uploadFile.name} successfully updated to MongoDB`,
              6
            )
          : message.error(
              `Sorry, an error occurred uploading to MongoDB: ${resData.errors[0].message}`,
              6
            );
      })
      .catch((err) => console.error(err));
  };

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
          const name = response.image;
          const url = response.location;

          uploadFileToMongoDB(name, url);
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

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
