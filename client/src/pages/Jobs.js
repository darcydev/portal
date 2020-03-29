import React, { useState, useEffect } from 'react';
import { Table, Tag, Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

export default function Jobs() {
  const [jobs, handleJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    let requestBody = {
      query: `
      query { 
        jobs {
          _id
          code
          title
          description
          tags
          createdAt
          client {
            _id
            code
          }
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
      .then((resData) => handleJobs(resData.data.jobs))
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <h1>the jobs page</h1>
      <Table
        pagination={false}
        // change the key name (from _id to key) in an array of objects
        dataSource={jobs.map(({ _id: key, ...rest }) => ({ key, ...rest }))}
        columns={[
          {
            title: 'Code',
            dataIndex: 'code',
            key: 'code'
          },
          {
            title: 'Title',
            dataIndex: 'title',
            key: 'title'
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
          },
          {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags'
          },
          {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <span>
                <Link style={{ marginRight: 16 }} to={`/job/${record.code}`}>
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
