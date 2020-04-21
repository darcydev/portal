import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { List, Select } from 'antd';
import Moment from 'react-moment';

import CustomTag from '../components/Tag';
import SearchBar from '../components/DataEntry/SearchBar';
import FileUpload from '../components/DataEntry/FileUpload';

const createSelectOptions = (dataArray) => {
  return dataArray.map((v, i) => (
    <Select.Option key={`${i}: ${v}`} value={v} label={v}>
      {v}
    </Select.Option>
  ));
};

const props = {
  allowClear: true,
  showArrow: true,
  mode: 'multiple',
};

export default function Files() {
  const [files, setFiles] = useState([]);
  const [clients, setClients] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [filters, setFilters] = useState({
    fileName: null,
    fileType: null,
    fileTag: null,
    jobName: null,
    jobTag: null,
    clientName: null,
  });

  useEffect(() => {
    fetchFiles();
    fetchClientCodes();
    fetchJobCodes();
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

  async function fetchJobCodes() {
    let requestBody = {
      query: `
				query { 
					jobs {
						code
						title
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
      .then((resData) => setJobs(resData.data.jobs))
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
					type
					updatedAt
					tags
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
        setFiles(resData.data.files);
      })
      .catch((err) => console.error(err));
  }

  const data = [];
  const getFilteredFiles = () => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const {
        fileName,
        fileType,
        fileTag,
        jobName,
        jobTag,
        clientName,
      } = filters;

      /* FILTER HANDLING */
      if (fileName && !fileName.includes(file.name)) continue;
      if (fileType && !fileType.includes(file.type)) continue;
      if (fileTag && !fileTag.includes(file.tag)) continue;
      if (jobName && !jobName.includes(file.jobName)) continue;
      if (jobTag && !jobTag.includes(file.jobTag)) continue;
      if (clientName && !clientName.includes(file.clientCode)) continue;

      // if the file has passed all filters, push it on the data array to be displayed
      data.push({
        _id: file._id,
        href: file.url,
        title: file.name,
        description: 'Insert Description',
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
        <FileUpload />
        <div className='search-and-filter'>
          <Select
            {...props}
            placeholder='File Name'
            onChange={(e) => setFilters({ fileName: e })}
            onDeselect={clearFilters}
            style={{ width: '100%' }}
          >
            {createSelectOptions([...new Set(files.map((v) => v.name))])}
          </Select>
          <Select
            {...props}
            placeholder='File Tag'
            onChange={(e) => setFilters({ fileTag: e })}
            onDeselect={clearFilters}
            style={{ width: '100%' }}
          >
            {createSelectOptions([...new Set(files.map((v) => v.tag))])}
          </Select>
          <Select
            {...props}
            placeholder='File Type'
            onChange={(e) => setFilters({ fileType: e })}
            onDeselect={clearFilters}
            style={{ width: '100%' }}
          >
            {createSelectOptions([...new Set(files.map((v) => v.type))])}
          </Select>
          <Select
            {...props}
            placeholder='Job'
            onChange={(e) => setFilters({ jobName: e })}
            onDeselect={clearFilters}
            style={{ width: '100%' }}
          >
            {createSelectOptions([
              ...new Set(jobs.map((v) => `${v.title} (${v.code})`)),
            ])}
          </Select>
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
              updated at: <Moment>{item.updatedAt}</Moment>
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
