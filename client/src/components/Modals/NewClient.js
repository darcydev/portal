import React, { useState, useContext } from 'react';
import { Form, Input, Modal, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

import BigSquareButton from '../Buttons/BigSquareButton';
import AuthContext from '../../context/auth-context';

export default function NewClient() {
  const [visible, handleVisible] = useState(false);

  const [form] = Form.useForm();
  const AUTH_CONTEXT = useContext(AuthContext);

  const onModalOpen = () => handleVisible(true);

  const onFinish = (values) => {
    createClient(values.code, values.name);
  };

  const onCancel = () => handleVisible(false);

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
      .then((resData) => {
        resData.data.createClient
          ? message
              .success(
                `${resData.data.createClient.code} successfully created`,
                3
              )
              .then(() => handleVisible(false))
          : message.error('there has been an error', 3);
      })
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <BigSquareButton
        onClick={onModalOpen}
        icon={<UserAddOutlined style={{ fontSize: '30px' }} />}
        text='NEW CLIENT'
      />
      <Modal
        visible={visible}
        title='Create a Client'
        onCancel={onCancel}
        onOk={() =>
          form
            .validateFields()
            .then((values) => onFinish(values))
            .catch((err) => console.err('Create Client Validate Failed:', err))
        }
      >
        <Form form={form} layout='horizontal'>
          <Form.Item name='code' label='Client Code'>
            <Input type='textarea' />
          </Form.Item>
          <Form.Item name='name' label='Client Name'>
            <Input type='textarea' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
