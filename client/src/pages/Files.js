import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { List, Table, Button, Input } from 'antd';

export default function Files() {
  const data = [];
  for (let i = 1; i < 100; i++) {
    data.push({
      href: 'http://ant.design',
      title: `File ${i}`,
      description: 'This is a template file description section',
    });
  }

  // TODO fetch files

  // TODO fetch job codes

  // TODO fetch clients

  return (
    <StyledContainer>
      <h1>files page</h1>
      <section className='files-section'>
        <div className='search-and-filter'>
          <Input.Search
            placeholder='Filter by Job code'
            enterButton='Search'
            size='large'
            onSearch={(value) => console.log(value)}
          />
          <Input.Search
            placeholder='Filter by File Tag'
            enterButton='Search'
            size='large'
            onSearch={(value) => console.log(value)}
          />
          <Input.Search
            placeholder='Filter by Job tag'
            enterButton='Search'
            size='large'
            onSearch={(value) => console.log(value)}
          />
          <Input.Search
            placeholder='Search by File name'
            enterButton='Search'
            size='large'
            onSearch={(value) => console.log(value)}
          />
        </div>
        <List
          itemLayout='vertical'
          size='large'
          dataSource={data}
          renderItem={(item) => (
            <Link to={`/file/TODO`}>
              <List.Item
                key={item.title}
                extra={
                  <img
                    width={272}
                    alt='logo'
                    src='https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png'
                  />
                }
              >
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
                include tags include job info include timestamps
              </List.Item>
            </Link>
          )}
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 20,
          }}
        ></List>
      </section>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  .search-and-filter {
    display: flex;
    justify-content: space-between;

    .ant-input-search {
      margin: 0 10px;
    }
  }
`;
