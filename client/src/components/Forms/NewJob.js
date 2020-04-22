import React, { useState, useContext, useEffect } from 'react';
import { Button, Select, Form, Input, message } from 'antd';

import AuthContext from '../../context/auth-context';
import FileUpload from '../DataEntry/FileUpload';

const { Option } = Select;

export default function NewJob() {
  const [clients, handleClients] = useState([]);
  const [form] = Form.useForm();
  const AUTH_CONTEXT = useContext(AuthContext);

  useEffect(() => {
    fetchClients();
  }, []);

  const onFinish = (values) => {
    createJob(values);
  };

  async function fetchClients() {
    let requestBody = {
      query: `
				query { 
					clients {
						_id
						code
						name
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
      .then((resData) => handleClients(resData.data.clients))
      .catch((err) => console.error(err));
  }

  async function createJob(values) {
    const { clientId, code, title, description, tags } = values;

    let requestBody = {
      query: `
          mutation { 
            createJob(jobInput: {client: "${clientId}", code: "${code}", title: "${title}", description: "${description}", tags: ["${tags}"]}) {
              _id
              code
            }
          }
        `,
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

        resData.data.createJob
          ? message.success(
              `${resData.data.createJob.code} successfully created`,
              3
            )
          : message.error('there has been an error', 3);
      })
      .catch((err) => console.error(err));
  }

  return (
    <Form form={form} layout='vertical' onFinish={onFinish}>
      <Form.Item
        name='clientId'
        label='Client'
        rules={[{ required: true, message: 'Please select the Client' }]}
      >
        <Select
          showSearch
          optionFilterProp='children'
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {clients &&
            clients.map((client, i) => (
              <Option key={client._id} value={client._id}>
                {client.name} ({client.code})
              </Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item name='code' label='Job Code'>
        <Input type='textarea' />
      </Form.Item>
      <Form.Item
        name='title'
        label='Job Title'
        rules={[{ required: true, message: 'Please enter Job title' }]}
      >
        <Input type='textarea' />
      </Form.Item>
      <Form.Item name='description' label='Job Description'>
        <Input type='textarea' />
      </Form.Item>
      <Form.Item name='tags' label='Job Tags'>
        <Select
          mode='multiple'
          placeholder='Select as many tags as applicable'
          optionLabelProp='label'
        >
          <Option value='animation' label='Animation'>
            Animation
          </Option>
          <Option value='website' label='Website'>
            Website
          </Option>
          <Option value='artwork' label='Artwork'>
            Artwork
          </Option>
          <Option value='maps' label='Maps'>
            Maps
          </Option>
        </Select>
      </Form.Item>
      <Form.Item name='target-audience' label='Target Audience'>
        <Input type='textarea' />
      </Form.Item>
      <Form.Item
        name='call-to-action'
        label='Call to action (what do you want people to do as a result of this?)'
      >
        <Input type='textarea' />
      </Form.Item>
      <Form.Item
        name='who-sign-off'
        label='Who should we contact to sign off and provide feedback?'
      >
        <Input type='textarea' />
      </Form.Item>
      <Form.Item
        name='previous-jobs'
        label='Are there any previous jobs you would like to use as a reference? (e.g PN8981 A4 Flyer)'
      >
        <Input type='textarea' />
      </Form.Item>
      <Form.Item name='files' label='Relevant Files'>
        <FileUpload />
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit'>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
