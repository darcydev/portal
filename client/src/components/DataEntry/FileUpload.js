import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Form, message, Select, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import AuthContext from '../../context/auth-context';

const { Option } = Select;

export default function FileUpload() {
  const [uploadToS3Failed, setUploadToS3Failed] = useState(false);
  const [file, setFile] = useState({
    name: null,
    url: null,
    type: null,
    updatedAt: null,
  });
  const [jobs, setJobs] = useState([]);
  const AUTH_CONTEXT = useContext(AuthContext);

  useEffect(() => {
    fetchJobs();
  }, []);

  const onFinish = (values) => {
    uploadFileToMongoDB(values);
  };

  const uploadFileToMongoDB = async (values) => {
    console.log('values :', values);
    const { name, url, type, updatedAt } = file;

    // TODO include values from form into backend
    const requestBody = {
      query: `
			mutation {
				uploadFile(fileInput: {name: "${name}", url: "${url}", type: "${type}", updatedAt: "${updatedAt}"}) {
					name
					type
					updatedAt
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
    multiple: false, // set to single
    action: 'http://localhost:8000/api/s3/upload',
    onChange(info) {
      const { response, status, type, lastModifiedDate } = info.file;

      if (status === 'error') setUploadToS3Failed(true);
      else if (status === 'done') {
        if (response.error) setUploadToS3Failed(true);
        else {
          setFile({
            name: response.image,
            url: response.location,
            type: type,
            updatedAt: lastModifiedDate,
          });
        }
      }
    },
  };

  async function fetchJobs() {
    let requestBody = {
      query: `
				query { 
					jobs {
						_id
						code
						title
						client {
							_id
							name
							code
						}
					}
				}
			`,
    };

    const res = await fetch('http://localhost:8000/api/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    res
      .json()
      .then((resData) => setJobs(resData.data.jobs))
      .catch((err) => console.error(err));
  }

  console.log('jobs :', jobs);

  return (
    <StyledForm onFinish={onFinish}>
      <Form.Item
        name='job-code'
        label='File Job Code'
        rules={[{ required: true, message: 'Select job code' }]}
      >
        <Select>
          {jobs &&
            jobs.map((job) => (
              <Select.Option key={job._id} value={job._id}>
                {job.title} ({job.code})
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item
        name='file-tags'
        label='File Tag(s)'
        rules={[{ required: true, message: 'Select file tags' }]}
      >
        <Select mode='multiple'>
          <Option value='china'>China</Option>
          <Option value='usa'>U.S.A</Option>
        </Select>
      </Form.Item>
      <Form.Item name='file-upload' label='File Upload'>
        <Upload.Dragger {...props}>
          <p className='ant-upload-drag-icon'>
            <InboxOutlined />
          </p>
          <p className='ant-upload-text'>
            Click or drag file to this area to upload
          </p>
        </Upload.Dragger>
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit' disabled={uploadToS3Failed}>
          Upload
        </Button>
      </Form.Item>
    </StyledForm>
  );
}

const StyledForm = styled(Form)`
  border: 2px solid black;
`;
