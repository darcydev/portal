import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';

export default function Auth() {
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
        console.log(resData);

        handleLogin(true);
      })
      .catch((err) => console.log(err));
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed', errorInfo);
  };

  console.log(isLogin);

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
