import React, { useState, useEffect } from 'react';
import { Table, Input } from 'antd';
import { Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

export default function Client() {
  const [clients, handleClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

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

  return (
    <div>
      <h1>the client page</h1>
      <Table
        pagination={false}
        // change the key name (from _id to key) in an array of objects
        dataSource={clients.map(({ _id: key, ...rest }) => ({ key, ...rest }))}
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
          },
          {
            title: 'Code',
            dataIndex: 'code',
            key: 'code'
          },
          {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <span>
                <Link style={{ marginRight: 16 }} to={`/client/${record.code}`}>
                  Details
                </Link>
              </span>
            )
          }
        ]}
      />
    </div>
  );
}
