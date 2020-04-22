import React, { Component, useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Form, message, Select, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import $ from 'jquery';

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
    uploadToS3()
      .then((success) => {
        if (success) uploadToMongoDB(values);
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
      return res.data.location && res.data.image ? true : false;
    } catch (error) {
      throw error;
    }
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
          //disabled={!formValid}> Upload
        </Button>
      </Form.Item>
    </StyledForm>
  );
}
/* 
export default class FileUpload extends Component {
  state = {
    selectedFile: null,
    selectedFiles: null,
    formValid: false,
  };

  singleFileChangedHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
    });
  };

  singleFileUploadHandler = (event) => {
    const data = new FormData();
    // If file selected
    if (this.state.selectedFile) {
      data.append(
        'files',
        this.state.selectedFile,
        this.state.selectedFile.name
      );
      axios
        .post('http://localhost:8000/api/s3/upload', data, {
          headers: {
            accept: 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          },
        })
        .then((response) => {
          console.log('response :', response);
          if (200 === response.status) {
            // If file size is larger than expected.
            if (response.data.error) {
              if ('LIMIT_FILE_SIZE' === response.data.error.code) {
                // TODO display too big message
              } else {
                // If not the given file type
                // TODO display error
              }
            } else {
              // TODO display success message
            }
          }
        })
        .catch((error) => {
          // TODO display error
        });
    } else {
      // if file not selected throw error
      // TODO display error
    }
  };

  render() {
    return (
      <StyledForm onFinish={this.onFinish}>
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
          <div>
            <input type='file' onChange={this.singleFileChangedHandler} />
            <button onClick={this.singleFileUploadHandler}>Upload!</button>
          </div>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            //disabled={!this.state.formValid}> Upload
          </Button>
        </Form.Item>
      </StyledForm>
    );
  }
} */

const StyledForm = styled(Form)`
  border: 2px solid black;
`;
