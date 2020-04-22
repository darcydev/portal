import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Form, message, Select, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
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
  const [formValid, setFormValid] = useState(false);
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
    console.log('values :>> ', values);

    // upload to S3
    uploadToS3(values.files)
      .then(console.log('done'))
      .catch((err) => console.log(err));

    // if successful, upload to MongoDB

    uploadToMongoDB(values);
  };

  const uploadToS3 = async (files) => {
    const url = `http://localhost:8000/api/s3/upload`;

    try {
      const res = await axios.post(url, files);
      console.log('res :>> ', res);
    } catch (error) {
      throw error;
    }

    /*     const res = await fetch(url, {
      method: 'POST',
      body: files,
    }); */
  };

  const uploadToMongoDB = async (values) => {
    const { jobId, tags } = values;
    const { name, url, type, updatedAt } = file;

    const requestBody = {
      query: `
			mutation {
				uploadFile(fileInput: {name: "${name}", url: "${url}", type: "${type}", updatedAt: "${updatedAt}", job: "${jobId}", tags: "${tags}"}) {
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

  const props = {
    name: 'files',
    multiple: false, // set to single
    // action: !formValid ? 'http://localhost:8000/api/s3/upload' : '',
    onChange(info) {
      const { response, status, type, lastModifiedDate } = info.file;
      if (status === 'error') setFormValid(false);
      else if (status === 'done') {
        if (response.error) setFormValid(true);
        else {
          message.success('Uploaded to S3');
          setFile({
            name: response.image,
            url: response.location,
            type: type,
            updatedAt: lastModifiedDate,
          });
        }
      }
    },
    /*     beforeUpload: (file) => {
      console.log('file :>> ', file);
      setFile(file);
      return false;
    }, */
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

  return (
    <StyledForm onFinish={onFinish}>
      <Form.Item
        name='jobId'
        label='File Job Code'
        rules={[{ required: true, message: 'Select job code' }]}
      >
        <Select>
          {jobs &&
            jobs.map((job, i) => (
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
      <Form.Item
        name='files'
        label='File Upload'
        rules={[{ required: true, message: 'File required' }]}
      >
        <Upload {...props}>Select file</Upload>
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit'>
          {' '}
          //disabled={!formValid}> Upload
        </Button>
      </Form.Item>
    </StyledForm>
  );
}

const StyledForm = styled(Form)`
  border: 2px solid black;
`;
