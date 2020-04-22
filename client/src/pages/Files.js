import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { List } from 'antd';
import Moment from 'react-moment';

import CustomTag from '../components/Tag';
import SearchBar from '../components/DataEntry/SearchBar';
import FileUpload from '../components/DataEntry/FileUpload';
import { fileTags, jobTags } from '../context/tags';

export default function Files() {
  const [files, setFiles] = useState([]);
  const [clients, setClients] = useState([]);
  const [jobs, setJobs] = useState([]);
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
					job {
						_id
						title
						tags
					}
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

  const props = {
    allowClear: true,
    showArrow: true,
    mode: 'multiple',
    onDeselect: clearFilters,
  };

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
      if (fileTag && !fileTag.some((tag) => file.tags.includes(tag))) continue;
      if (jobName && !jobName.includes(file.jobName)) continue;
      // if (jobTag && !jobTag.some((tag) => file.jobTag)) continue;
      if (clientName && !clientName.includes(file.clientCode)) continue;

      // if the file has passed all filters, push it on the data array to be displayed
      data.push({
        _id: file._id,
        href: file.url,
        title: file.name,
        description: 'Insert Description',
        updatedAt: file.updatedAt,
        tags: file.tags,
        jobCodes: ['DPC9299', 'AAA123', 'XYB123'],
      });
    }

    return data;
  };
  getFilteredFiles();

  console.log('files', files);
  console.log('filters', filters);

  return (
    <StyledContainer>
      <h1>files page</h1>
      <section className='files-section'>
        <FileUpload />
        <div className='search-and-filter'>
          <SearchBar
            props={{
              ...props,
              placeholder: 'File name',
            }}
            optionsData={[...new Set(files.map((v) => v.name))]}
            passData={(e) => setFilters({ fileName: e })}
          />
          <SearchBar
            props={{
              ...props,
              placeholder: 'File tag',
            }}
            optionsData={fileTags}
            passData={(e) => setFilters({ fileTag: e })}
          />
          <SearchBar
            props={{
              ...props,
              placeholder: 'File type',
            }}
            optionsData={[...new Set(files.map((v) => v.type))]}
            passData={(e) => setFilters({ fileType: e })}
          />
          <SearchBar
            props={{
              ...props,
              placeholder: 'Job name',
            }}
            optionsData={[
              ...new Set(jobs.map((v) => `${v.title} (${v.code})`)),
            ]}
            passData={(e) => setFilters({ jobName: e })}
          />
          <SearchBar
            props={{ ...props, placeholder: 'Job tag' }}
            optionsData={jobTags}
            passData={(e) => setFilters({ jobTag: e })}
          />
          <SearchBar
            props={{ ...props, placeholder: 'Client name' }}
            optionsData={[
              ...new Set(clients.map((v) => `${v.name} (${v.code})`)),
            ]}
            passData={(e) => setFilters({ clientName: e })}
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
