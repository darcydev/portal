import React, { useState, useContext, useEffect } from 'react';
import {
  Button,
  Select,
  Form,
  Input,
  Modal,
  Upload,
  Radio,
  Progress,
  message
} from 'antd';
import {
  FolderAddOutlined,
  InboxOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
  MinusOutlined,
  PlusOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

import BigSquareButton from '../Buttons/BigSquareButton';
import AuthContext from '../../context/auth-context';

const { Dragger } = Upload;
const { Option } = Select;
const ButtonGroup = Button.Group;

export default function NewJob() {
  const [visible, handleVisible] = useState(false);
  const [clients, handleClients] = useState([]);
  const [time, setTime] = useState(0);
  const [budget, setBudget] = useState(0);

  const [form] = Form.useForm();
  const AUTH_CONTEXT = useContext(AuthContext);

  useEffect(() => {
    fetchClients();
  }, []);

  const onModalOpen = () => handleVisible(true);

  const onFinish = (values) => {
    createJob(
      values.clientId,
      values.code,
      values.title,
      values.description,
      values.tags
    );
  };

  const onCancel = () => handleVisible(false);

  // fetch all clients (for select dropdown box)
  async function fetchClients() {
    let requestBody = {
      query: `
      query { 
        clients {
          _id
          code
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
      .then((resData) => handleClients(resData.data.clients))
      .catch((err) => console.error(err));
  }

  // create client in backend
  async function createJob(clientId, code, title, description, tags) {
    let requestBody = {
      query: `
          mutation { 
            createJob(jobInput: {client: "${clientId}", code: "${code}", title: "${title}", description: "${description}", tags: ["${tags}"]}) {
              _id
              code
            }
          }
        `
    };

    const res = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_CONTEXT.token}`
      }
    });

    res
      .json()
      .then((resData) => {
        resData.data.createJob
          ? message
              .success(`${resData.data.createJob.code} successfully created`, 3)
              .then(() => handleVisible(false))
          : message.error('there has been an error', 3);
      })
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <BigSquareButton
        onClick={onModalOpen}
        icon={<FolderAddOutlined style={{ fontSize: '30px' }} />}
        text='NEW JOB'
      />
      <Modal
        visible={visible}
        title='New Job'
        onCancel={onCancel}
        onOk={() =>
          form
            .validateFields()
            .then((values) => onFinish(values))
            .catch((err) => console.err('Create Job Validate Failed:', err))
        }
      >
        <Form form={form} layout='vertical'>
          <Form.Item name='clientId' label='Client'>
            <Select
              showSearch
              optionFilterProp='children'
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {clients &&
                clients.map((client, i) => (
                  <Option key={client._id} value={client._id}>
                    {client.code}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name='code' label='Job Code'>
            <Input type='textarea' />
          </Form.Item>
          <Form.Item name='title' label='Job Title'>
            <Input type='textarea' />
          </Form.Item>
          <Form.Item name='description' label='Job Description'>
            <Input type='textarea' />
          </Form.Item>
          {/* INFO BOX */}
          <div className='info-box'>
            THIS IS AN INFO BOX OF USEFUL INFORMATION TO REMIND PEOPLE
          </div>
          {/* .INFO BOX */}
          <Form.Item name='tags' label='Job Tags'>
            <Select
              mode='multiple'
              placeholder='Select as many tags as applicable'
              optionLabelProp='label'
            >
              <Option value='animation' label='Animation'>
                Animation
              </Option>
              <Option value='website' label='Website'>
                Website
              </Option>
              <Option value='artwork' label='Artwork'>
                Artwork
              </Option>
              <Option value='maps' label='Maps'>
                Maps
              </Option>
            </Select>
          </Form.Item>
          <Form.Item name='target-audience' label='Target Audience'>
            <Input type='textarea' />
          </Form.Item>
          <Form.Item
            name='call-to-action'
            label='Call to action (what do you want people to do as a result of this?)'
          >
            <Input type='textarea' />
          </Form.Item>
          <Form.Item
            name='who-sign-off'
            label='Who should we contact to sign off and provide feedback?'
          >
            <Input type='textarea' />
          </Form.Item>
          <Form.Item
            name='previous-jobs'
            label='Are there any previous jobs you would like to use as a reference? (e.g PN8981 A4 Flyer)'
          >
            <Input type='textarea' />
          </Form.Item>
          {/* TIME ESTIMATE */}
          <div>
            <h4>What is your time frame for the project?</h4>
            <div className='info-box'>
              <p>
                {time < 5
                  ? 'This is a nice quick job, but we should still mention blah blah blah'
                  : "As a longer job, it's important to mention BLAH BLAH"}
              </p>
            </div>
            <StyledProgressBar>
              <Progress
                percent={time}
                format={(percent) =>
                  percent === 0
                    ? '< 1 week'
                    : percent === 1
                    ? `${percent} week`
                    : `${percent} weeks`
                }
              />
              <ButtonGroup>
                <Button
                  onClick={() => setTime(time - 10 < 0 ? 0 : time - 10)}
                  icon={<DoubleLeftOutlined />}
                />
                <Button
                  onClick={() => setTime(time - 1 < 0 ? 0 : time - 1)}
                  icon={<MinusOutlined />}
                />
                <Button
                  onClick={() => setTime(time + 1 > 99 ? 99 : time + 1)}
                  icon={<PlusOutlined />}
                />
                <Button
                  onClick={() => setTime(time + 10 > 99 ? 99 : time + 10)}
                  icon={<DoubleRightOutlined />}
                />
              </ButtonGroup>
            </StyledProgressBar>
          </div>
          {/* .TIME ESTIMATE */}
          {/* BUDGET ESTIMATE */}
          <div className='info-box'>
            <p>
              Based on these factors, we could assume that the budget for this
              job will be between
            </p>
          </div>
          {/* .BUDGET ESTIMATE */}
          <Form.Item name='files' label='Relevant Files'>
            <Dragger
              name='file'
              multiple={true}
              action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
              onChange={(info) => {
                const { status } = info.file;

                if (status !== 'uploading')
                  console.log(info.file, info.fileList);
                if (status !== 'done') {
                  message.success(
                    `${info.file.name} file uploaded successfully.`
                  );
                } else if (status !== 'error')
                  message.error(`${info.file.name} file upload failed`);
              }}
            >
              <p className='ant-upload-drag-icon'>
                <InboxOutlined />
              </p>
              <p className='ant-upload-text'>
                Click or drag file to this area to upload
              </p>
              <p className='ant-upload-hint'>
                Support for a single or bulk upload
              </p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const StyledProgressBar = styled.div`
  .ant-progress {
    display: flex;
    flex-direction: column;

    .ant-progess-outer {
      padding-right: 0px !important;
    }

    .ant-progress-text {
      width: 100%;
      text-align: center;
      font-size: 18px;
      padding: 10px 0;
    }
  }

  .ant-btn-group {
    text-align: center;
    width: 100%;
    padding: 10px 0;
  }
`;
