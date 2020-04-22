import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Form, Input, message, Select, Switch } from 'antd';
import axios from 'axios';

import AuthContext from '../../context/auth-context';
import { fileTags } from '../../context/tags';

const createSelectOptions = (dataArray) => {
  return dataArray.map((v, i) => (
    <Select.Option key={`${i}: ${v}`} value={v} label={v}>
      {v}
    </Select.Option>
  ));
};

export default function FileUpload() {
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
    console.log('values :>> ', values);

    uploadToS3()
      .then((res) => {
        const { image, location } = res.data;
        if (image && location) uploadToMongoDB(values, location);
        else message.error('Upload to S3 failed');
      })
      .catch((err) => console.log(err));
  };

  async function fetchJobs() {
    let requestBody = {
      query: `
				query { 
					jobs {
						_id
						code
						title
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

  const uploadToS3 = async () => {
    if (!file) return;

    const url = `http://localhost:8000/api/s3/upload`;
    const data = new FormData();
    data.append('files', file, file.name);

    try {
      const res = await axios.post(url, data, {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        },
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const uploadToMongoDB = async (values, url) => {
    const { jobId, tags, delivered, description } = values;
    const { name, type, lastModifiedDate } = file;

    const requestBody = {
      query: `
			mutation {
				uploadFile(fileInput: {name: "${name}", url: "${url}", type: "${type}", updatedAt: "${lastModifiedDate}", job: "${jobId}", tags: "${tags}", delivered: ${delivered}, description: "${description}"}) {
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
          ? message.success('successfully updated to MongoDB', 6)
          : message.error(`MongoDB error: ${resData.errors[0].message}`, 6);
      })
      .catch((err) => console.error(err));
  };

  return (
    <StyledForm onFinish={onFinish}>
      <Form.Item
        name='jobId'
        label='File Job Code'
        rules={[{ required: true, message: 'Select job code' }]}
      >
        <Select>
          {jobs &&
            jobs.map((job) => (
              <Select.Option key={job._id} value={job._id} label={job._id}>
                {`${job.title} (${job.code})`}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item
        name='tags'
        label='File Tag(s)'
        rules={[{ required: true, message: 'Select file tags' }]}
      >
        <Select mode='multiple'>{createSelectOptions(fileTags)}</Select>
      </Form.Item>
      <Form.Item name='description' label='Description'>
        <Input.TextArea allowClear />
      </Form.Item>
      <Form.Item name='delivered' label='Delivered?'>
        <Switch />
      </Form.Item>
      <Form.Item
        name='files'
        label='File Upload'
        rules={[{ required: true, message: 'File required' }]}
      >
        <input
          type='file'
          onChange={(event) => setFile(event.target.files[0])}
        />
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit'>
          Upload
        </Button>
      </Form.Item>
    </StyledForm>
  );
}

const StyledForm = styled(Form)`
  border: 2px solid black;
`;
