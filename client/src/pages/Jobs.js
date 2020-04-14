import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import CustomTag from '../components/Tag';

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
        }
      }
    `,
    };

    const res = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    res
      .json()
      .then((resData) => handleJobs(resData.data.jobs))
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <h1>All Jobs</h1>
      <Table
        pagination={false}
        // change the key name (from _id to key) in an array of objects
        dataSource={jobs.map(({ _id: key, ...rest }) => ({ key, ...rest }))}
        columns={[
          {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
          },
          {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
          },
          {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            render: (tags) => (
              <span>
                {tags.map((tag) => (
                  <CustomTag text={tag} />
                ))}
              </span>
            ),
          },
          {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
          },
          {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <span>
                <Link style={{ marginRight: 16 }} to={`/job/${record.key}`}>
                  Details
                </Link>
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
