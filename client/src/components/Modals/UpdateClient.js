import React, { useState, useContext, useEffect } from 'react';
import { Form, Input, Modal, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useParams, Link } from 'react-router-dom';

import BigSquareButton from '../Buttons/BigSquareButton';
import AuthContext from '../../context/auth-context';

export default function UpdateClient({ client }) {
  const [visible, handleVisible] = useState(false);
  const [form] = Form.useForm();
  const AUTH_CONTEXT = useContext(AuthContext);

  const onModalOpen = () => handleVisible(true);
  const onFinish = (values) => updateClient(values);
  const onCancel = () => handleVisible(false);

  async function updateClient(values) {
    let requestBody = {
      query: `
          mutation { 
            updateClient(clientUpdate: {code: "${values.code}", name: "${client.name}"}) {
              _id
              code
              name
            }
          }
        `,
    };

    const res = await fetch('http://localhost:8000/graphql', {
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

        resData.data.updateClient
          ? message
              .success(
                `${resData.data.updateClient.name} successfully updated`,
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
        text='UPDATE'
      />
      <Modal
        visible={visible}
        title='Update Client details'
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
            <Input
              type='textarea'
              defaultValue={client ? (client.code ? client.code : '0') : null}
            />
          </Form.Item>
          <Form.Item name='name' label='Client Name'>
            <Input
              type='textarea'
              disabled={true}
              defaultValue={client ? client.name : null}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
