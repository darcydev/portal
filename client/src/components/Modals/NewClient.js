import React, { useState, useContext } from 'react';
import { Form, Input, Modal } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

import BigSquareButton from '../Buttons/BigSquareButton';

import AuthContext from '../../context/auth-context';

export default function NewClient() {
  const [visible, handleVisible] = useState(false);
  const [loading, handleLoading] = useState(false);

  const [form] = Form.useForm();
  const AUTH_CONTEXT = useContext(AuthContext);

  console.log(AUTH_CONTEXT);

  const onModalOpen = () => handleVisible(true);

  const onFinish = (values) => {
    const { code, name } = values;

    createClient(code, name);
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
      .then((resData) => console.log(resData))
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <BigSquareButton
        onClick={onModalOpen}
        icon={<UserAddOutlined />}
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
