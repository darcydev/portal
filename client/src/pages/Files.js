import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { List, Select } from 'antd';
import Moment from 'react-moment';

import CustomTag from '../components/Tag';
import SearchBar from '../components/DataEntry/SearchBar';

export default function Files() {
  const [files, setFiles] = useState([]);
  const [clients, setClients] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [filters, setFilters] = useState({
    fileName: null,
    fileType: null,
    fileTag: null,
    jobCode: null,
    jobTag: null,
    clientName: null,
  });

  useEffect(() => {
    fetchFiles();
    fetchClientCodes();
  }, []);

  const clearFilters = () => {
    setFilters({
      fileName: null,
      fileType: null,
      fileTag: null,
      jobCode: null,
      jobTag: null,
      clientName: null,
    });
  };

  async function fetchClientCodes() {
    const requestBody = {
      query: `
      query { 
        clients {
          code
          name
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
      .then((resData) => setClients(resData.data.clients))
      .catch((err) => console.error(err));
  }

  async function fetchFiles() {
    let requestBody = {
      query: `
      query { 
        files {
          _id
					name
					url
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
      .then((resData) => setFiles(resData.data.files))
      .catch((err) => console.error(err));
  }

  const data = [];
  const getFilteredFiles = () => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      /* FILTER HANDLING */
      if (filters.fileName && !filters.fileName.includes(file.name)) {
        continue;
      }
      if (filters.fileType && !filters.fileType.includes(file.type)) {
        continue;
      }
      if (filters.fileTag && !filters.fileTag.includes(file.tag)) {
        continue;
      }
      if (filters.jobCode && !filters.jobCode.includes(file.jobCode)) {
        continue;
      }
      if (filters.jobTag && !filters.jobCode.includes(file.jobTag)) {
        continue;
      }
      if (filters.clientCode && !filters.jobCode.includes(file.clientCode)) {
        continue;
      }

      // if the file has passed all filters, push it on the data array to be displayed
      data.push({
        _id: file._id,
        href: file.url,
        title: file.name,
        description: 'Insert Description',
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
        tags: ['Animation', 'Web Design', 'Business Card'],
        jobCodes: ['DPC9299', 'AAA123', 'XYB123'],
      });
    }

    return data;
  };
  getFilteredFiles();

  return (
    <StyledContainer>
      <h1>files page</h1>
      <section className='files-section'>
        <div className='search-and-filter'>
          <Select
            mode='multiple'
            placeholder='File Name'
            onChange={(e) => setFilters({ fileName: e })}
            onDeselect={(e) => console.log(e)}
            style={{ width: '100%' }}
            allowClear={true}
            showArrow={true}
          >
            {files.map((v, i) => (
              <Select.Option
                key={`${i}: ${v.name}`}
                value={v.name}
                label={v.name}
              >
                {v.name}
              </Select.Option>
            ))}
          </Select>
          <SearchBar
            placeholder='File Type'
            data={['png', 'jpg', 'mp3', 'mp4', 'pdf']}
          />
          {/* <SearchBar placeholder='File Tag' data={files.map((v) => v.tags)} /> */}
          <SearchBar placeholder='Job' />
          <SearchBar placeholder='Job Tag' />
          <SearchBar
            placeholder='Client'
            data={clients.map((v) => `${v.name} (${v.code})`)}
          />
        </div>
        <List
          itemLayout='vertical'
          size='large'
          dataSource={data}
          renderItem={(item) => (
            <List.Item
              key={item.href}
              extra={
                <Link to={`/file/${item._id}`}>
                  <img width={272} alt={item.title} src={`${item.href}`} />
                </Link>
              }
            >
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
              created at: <Moment unix>{item.createdAt}</Moment>
              <br />
              updated at: <Moment unix>{item.updatedAt}</Moment>
              <br />
              {item.tags.map((tag, i) => (
                <CustomTag key={`${i}: ${tag}`} text={tag} />
              ))}
            </List.Item>
          )}
          pagination={{
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
