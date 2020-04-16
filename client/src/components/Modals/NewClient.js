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
    createClient(values);
  };

  const onCancel = () => handleVisible(false);

  async function createClient(values) {
    let { code, name } = values;

    // if the Client doesn't have a code yet, give it a default code of '0'
    if (code === undefined) code = '0';

    let requestBody = {
      query: `
          mutation { 
            createClient(clientInput: {code: "${code}", name: "${name}"}) {
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
        Authorization: `Bearer ${AUTH_CONTEXT.token}`,
      },
    });

    res
      .json()
      .then((resData) => {
        resData.data.createClient
          ? message
              .success(
                `${resData.data.createClient.name} successfully created`,
                6
              )
              .then(() => handleVisible(false))
          : message.error(
              `Sorry, an error occurred: ${resData.errors[0].message}`,
              6
            );
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
          <Form.Item
            name='code'
            label='Client Code'
            rules={[{ required: false }]}
          >
            <Input type='textarea' />
          </Form.Item>
          <Form.Item
            name='name'
            label='Client Name'
            rules={[{ required: true, message: 'Client name required' }]}
          >
            <Input type='textarea' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
