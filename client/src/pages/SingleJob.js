import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, PageHeader, Tabs, Button, Descriptions } from 'antd';
import Moment from 'react-moment';
import styled from 'styled-components';

export default function SingleJob() {
  const [job, setJob] = useState(null);
  const [files, setFiles] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetchJobById();
  }, []);

  async function fetchJobById() {
    const requestBody = {
      query: `
			query {
				jobById(id: "${id}") {
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
          createdAt
          updatedAt
				}
			}
			`,
    };

    const res = await fetch('http://localhost:8000/api/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    res
      .json()
      .then((resData) => {
        if (!resData.data)
          throw new Error(`SingleJob error: ${resData.errors[0].message}`);

        setJob(resData.data.jobById);
      })
      .catch((err) => console.error(err));
  }

  // fetch all files associated with this job
  // TODO

  return (
    <div>
      <PageHeader
        className='site-page-header-responsive'
        onBack={() => window.history.back()}
        title={job ? job.title : 'Loading'}
        subTitle={job ? `Job Code: ${job.code}` : 'No code yet'}
        extra={[
          <Button key='2' type='primary'>
            Update
          </Button>,
          <Button key='1' type='danger'>
            Delete
          </Button>,
        ]}
        footer={
          <Tabs>
            <Tabs.TabPane tab='Colors' key='1'>
              <StyledTabContent>one</StyledTabContent>
            </Tabs.TabPane>
            <Tabs.TabPane tab='Delivered' key='2'>
              <StyledTabContent>
                <StyledFlexContainer>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt='example'
                        src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
                      />
                    }
                  >
                    <Card.Meta
                      title='Europe Street beat'
                      description='www.instagram.com'
                    />
                  </Card>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt='example'
                        src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
                      />
                    }
                  >
                    <Card.Meta
                      title='Europe Street beat'
                      description='www.instagram.com'
                    />
                  </Card>
                </StyledFlexContainer>
              </StyledTabContent>
            </Tabs.TabPane>
            <Tabs.TabPane tab='Graveyard' key='3'>
              <StyledTabContent>
                <StyledFlexContainer>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt='example'
                        src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
                      />
                    }
                  >
                    <Card.Meta
                      title='Europe Street beat'
                      description='www.instagram.com'
                    />
                  </Card>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt='example'
                        src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
                      />
                    }
                  >
                    <Card.Meta
                      title='Europe Street beat'
                      description='www.instagram.com'
                    />
                  </Card>
                </StyledFlexContainer>
              </StyledTabContent>
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
            {job ? <Moment>{job.createdAt}</Moment> : 'Loading'}
          </Descriptions.Item>
          <Descriptions.Item label='Updated At'>
            {job ? <Moment fromNow>{job.updatedAt}</Moment> : 'Loading'}
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
    </div>
  );
}

const StyledTabContent = styled.div`
  padding: 40px 0;
`;

const StyledFlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;

  .ant-card {
    flex: 1 0 500px;
    box-sizing: border-box;
    margin: 1rem 0.25em;
    max-width: 300px;
  }
`;
