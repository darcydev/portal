import React, { useState, useContext } from 'react';
import { Form, Input, Button } from 'antd';

import AuthContext from '../context/auth-context';

export default function Auth() {
  const context = useContext(AuthContext);

  console.log(context);

  const [isLogin, handleLogin] = useState(false);

  const onFinish = (values) => {
    const { email, password } = values;

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) throw new Error('Failed');

        return res.json();
      })
      .then((resData) => {
        if (resData.data.login.token) {
          context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch((err) => console.error(err));
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed', errorInfo);
  };

  return (
    <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <Form.Item
        label='email'
        name='email'
        rules={[
          {
            type: 'email',
            message: 'Please enter valid email'
          },
          {
            required: true,
            message: 'Please enter email'
          }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label='password'
        name='password'
        rules={[
          {
            required: true,
            message: 'Please enter password'
          }
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        {isLogin ? (
          <Button type='secondary'>TICK</Button>
        ) : (
          <Button type='primary' htmlType='submit'>
            Login
          </Button>
        )}
      </Form.Item>
    </Form>
  );
}
