import React, { useState, useContext, useEffect } from 'react';
import { Select, Form, Input, Modal, Upload, message } from 'antd';
import {
  PlusOutlined,
  FolderAddOutlined,
  InboxOutlined
} from '@ant-design/icons';

import BigSquareButton from '../Buttons/BigSquareButton';

import AuthContext from '../../context/auth-context';

const { Dragger } = Upload;
const { Option } = Select;

export default function NewJob() {
  const [visible, handleVisible] = useState(false);
  const [loading, handleLoading] = useState(false);
  const [clients, handleClients] = useState([]);

  const [form] = Form.useForm();
  const AUTH_CONTEXT = useContext(AuthContext);

  useEffect(() => {
    fetchClients();
  }, []);

  const onModalOpen = () => handleVisible(true);

  const onFinish = (values) => {
    const { code, name } = values;

    createClient(code, name);
  };

  const onCancel = () => handleVisible(false);

  // fetch all clients (for select dropdown box)
  async function fetchClients() {
    let requestBody = {
      query: `
      query { 
        clients {
          _id
          code
        }
      }
    `
    };

    const res = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res
      .json()
      .then((resData) => handleClients(resData.data.clients))
      .catch((err) => console.error(err));
  }

  // create client in backend
  async function createClient(code, name) {
    let requestBody = {
      query: `
          mutation { 
            createClient(clientInput: {code: "${code}", name: "${name}"}) {
              _id
              code
              name
            }
          }
        `
    };

    const res = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_CONTEXT.token}`
      }
    });

    res
      .json()
      .then((resData) => console.log(resData))
      .catch((err) => console.error(err));
  }

  console.log(clients);

  return (
    <div>
      <BigSquareButton
        onClick={onModalOpen}
        icon={<FolderAddOutlined style={{ fontSize: '30px' }} />}
        text='NEW CLIENT'
      />
      <Modal
        visible={visible}
        title='New Job'
        onCancel={onCancel}
        onOk={() =>
          form
            .validateFields()
            .then((values) => onFinish(values))
            .catch((err) => console.err('Create Job Validate Failed:', err))
        }
      >
        <Form form={form} layout='horizontal'>
          <Form.Item name='clientId' label='Client'>
            <Select
              showSearch
              optionFilterProp='children'
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {clients &&
                clients.map((client, i) => (
                  <Option key={client._id} value={client.code}>
                    {client.code}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name='code' label='Job Code'>
            <Input type='textarea' />
          </Form.Item>
          <Form.Item name='title' label='Job Title'>
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
          <Form.Item name='files' label='Relevant Files'>
            <Dragger
              name='file'
              multiple={true}
              action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
              onChange={(info) => {
                const { status } = info.file;

                if (status !== 'uploading')
                  console.log(info.file, info.fileList);
                if (status !== 'done') {
                  message.success(
                    `${info.file.name} file uploaded successfully.`
                  );
                } else if (status !== 'error')
                  message.error(`${info.file.name} file upload failed`);
              }}
            >
              <p className='ant-upload-drag-icon'>
                <InboxOutlined />
              </p>
              <p className='ant-upload-text'>
                Click or drag file to this area to upload
              </p>
              <p className='ant-upload-hint'>
                Support for a single or bulk upload
              </p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
