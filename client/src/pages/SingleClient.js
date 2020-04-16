import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader, Table, Tag, Tabs, Button, Descriptions } from 'antd';

import NewJob from '../components/Modals/NewJob';
import UpdateClient from '../components/Modals/UpdateClient';

export default function SingleClient() {
  const [client, handleClient] = useState(null);
  const [jobs, handleJobs] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetchClientById();
  }, []);

  async function fetchClientById() {
    const requestBody = {
      query: `
			query {
				clientById(id: "${id}") {
					_id
					code
					name
					createdAt
					updatedAt
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
      .then((resData) => {
        handleClient(resData.data.clientById);
        fetchJobsByClientId(resData.data.clientByCode._id);
      })
      .catch((err) => console.error(err));
  }

  // TODO
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
      }`,
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
      .then((resData) => handleJobs(resData.data.jobsByClientId))
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <PageHeader
        className='site-page-header-responsive'
        onBack={() => window.history.back()}
        title={client ? client.name : 'Loading'}
        subTitle={
          client
            ? `Client Code: ${client.code}`
            : 'Client Code not assigned yet'
        }
        extra={[
          <NewJob />,
          <UpdateClient client={client} />,
          <Button key='1' type='danger'>
            Delete
          </Button>,
        ]}
        footer={
          <Tabs>
            <Tabs.TabPane tab='Jobs' key='1'>
              <Table
                pagination={false}
                // change the key name (from _id to key) in an array of objects
                dataSource={jobs.map(({ _id: key, ...rest }) => ({
                  key,
                  ...rest,
                }))}
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
                    dataIndex: 'Description',
                    key: 'description',
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
                    ),
                  },
                  {
                    title: 'Action',
                    key: 'action',
                    render: (text, record) => (
                      <Link
                        style={{ marginRight: 16 }}
                        to={`/job/${record.code}`}
                      >
                        Details
                      </Link>
                    ),
                  },
                ]}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab='Style Guide' key='2'>
              Style Guide
            </Tabs.TabPane>
            <Tabs.TabPane tab='Color Swatch' key='3'>
              Color Swatch
            </Tabs.TabPane>
            <Tabs.TabPane tab='Logos' key='4'>
              Logos
            </Tabs.TabPane>
          </Tabs>
        }
      >
        <Descriptions size='small' column={2}>
          <Descriptions.Item label='Created At'>
            {client ? client.createdAt : null}
          </Descriptions.Item>
          <Descriptions.Item label='Updated At'>
            {client ? client.updatedAt : null}
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
    </div>
  );
}
