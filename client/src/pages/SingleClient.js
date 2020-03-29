import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Table, Tag } from 'antd';

export default function SingleClient() {
  const [client, handleClient] = useState(null);
  const [jobs, handleJobs] = useState([]);

  const { code } = useParams();

  useEffect(() => {
    fetchClientByCode();
  }, []);

  async function fetchClientByCode() {
    let requestBody = {
      query: `
      query {
        clientByCode(code: "${code}") {
          _id
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
      .then((resData) => {
        handleClient(resData.data.clientByCode);
        fetchJobsByClientId(resData.data.clientByCode._id);
      })
      .catch((err) => console.error(err));
  }

  async function fetchJobsByClientId(clientId) {
    let requestBody = {
      query: `
      query {
        jobsByClientId(clientId: "${clientId}") {
          _id
          code
          title
          description
          tags
          files
        }
      }`
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
      .then((resData) => handleJobs(resData.data.jobsByClientId))
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <h1>single client page</h1>
      <h4>this client: {code}</h4>
      <h5>this clients jobs:</h5>
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
            dataIndex: 'Description',
            key: 'description'
          },
          {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (tags) => (
              <span>
                {tags.map((tag) => {
                  let color = tag.length > 5 ? 'geekblue' : 'green';
                  if (tag === 'loser') {
                    color = 'volcano';
                  }
                  return (
                    <Tag color={color} key={tag}>
                      {tag.toUpperCase()}
                    </Tag>
                  );
                })}
              </span>
            )
          },
          {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <Link style={{ marginRight: 16 }} to={`/job/${record.code}`}>
                Details
              </Link>
            )
          }
        ]}
      />
    </div>
  );
}
