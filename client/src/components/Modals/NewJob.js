import React, { useState, useContext } from 'react';
import { Modal } from 'antd';
import { FolderAddOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import BigSquareButton from '../Buttons/BigSquareButton';
import NewJobForm from '../Forms/NewJob';
import AuthContext from '../../context/auth-context';

export default function NewJob() {
  const [visible, handleVisible] = useState(false);
  const AUTH_CONTEXT = useContext(AuthContext);

  const onModalOpen = () => handleVisible(true);

  const onFinish = (values) => {
    /* createJob(
      values.clientId,
      values.code,
      values.title,
      values.description,
      values.tags
		); */
    console.log('do something');
  };

  const onCancel = () => handleVisible(false);

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
        onOk={onCancel}
      >
        <NewJobForm />
        <div className='tips-container'>
          <h1>TIP CONTAINER</h1>
        </div>
        <div className='client-container'>
          <h1>CLIENT CONTAINER</h1>
        </div>
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
