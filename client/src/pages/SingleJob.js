import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader, Table, Tag, Tabs, Button, Descriptions } from 'antd';

export default function SingleJob() {
  const [job, handleJob] = useState(null);

  const { code } = useParams();

  useEffect(() => {
    fetchJobByCode();
  }, []);

  async function fetchJobByCode() {
    let requestBody = {
      query: `
      query {
        jobByCode(code: "${code}") {
          _id
          client {
            _id
            name
            code
          }
          code
          title
          description
          tags
          colors
          files
          createdAt
          updatedAt
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
        handleJob(resData.data.jobByCode);
      })
      .catch((err) => console.error(err));
  }

  console.log(job);

  return (
    <div>
      <PageHeader
        className='site-page-header-responsive'
        onBack={() => window.history.back()}
        title={job ? job.title : 'Loading'}
        subTitle={`Client Code: ${code}`}
        extra={[
          <Button key='2' type='primary'>
            Update
          </Button>,
          <Button key='1' type='danger'>
            Delete
          </Button>
        ]}
        footer={
          <Tabs>
            <Tabs.TabPane tab='Colors' key='1'>
              one
            </Tabs.TabPane>
            <Tabs.TabPane tab='Delivered' key='2'>
              two
            </Tabs.TabPane>
            <Tabs.TabPane tab='Graveyard' key='3'>
              three
            </Tabs.TabPane>
          </Tabs>
        }
      >
        <Descriptions size='small' column={2}>
          <Descriptions.Item label='Job Description'>
            {job ? job.description : 'Loading'}
          </Descriptions.Item>
          <Descriptions.Item label='Client'>
            {job ? job.client.name : 'Loading'}
          </Descriptions.Item>
          <Descriptions.Item label='Client Code'>
            {job ? job.client.code : 'Loading'}
          </Descriptions.Item>
          <Descriptions.Item label='Tags'>
            {job ? job.tags : 'Loading'}
          </Descriptions.Item>
          <Descriptions.Item label='Created At'>
            {job ? job.createdAt : 'Loading'}
          </Descriptions.Item>
          <Descriptions.Item label='Updated At'>
            {job ? job.updatedAt : 'Loading'}
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
    </div>
  );
}
