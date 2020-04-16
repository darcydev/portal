import React from 'react';
import { Link } from 'react-router-dom';
import { List, Table, Button, Input } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const IconText = ({ icon, text }) => (
  <span>
    {React.createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </span>
);

export default function Files() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      href: 'http://ant.design',
      title: `File ${i}`,
      description: 'This is a template file description section',
    });
  }

  return (
    <div>
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
                actions={[
                  <IconText
                    icon={DownloadOutlined}
                    text='45'
                    key='list-vertical-message'
                  />,
                ]}
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
    </div>
  );
}
