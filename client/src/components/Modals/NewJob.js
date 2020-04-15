import React, { useState } from 'react';
import { Modal } from 'antd';
import { FolderAddOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Resizable } from 're-resizable';

import BigSquareButton from '../Buttons/BigSquareButton';
import NewJobForm from '../Forms/NewJob';

export default function NewJob() {
  const [visible, handleVisible] = useState(false);

  const onModalOpen = () => handleVisible(true);
  const onCancel = () => handleVisible(false);

  return (
    <div>
      <BigSquareButton
        onClick={onModalOpen}
        icon={<FolderAddOutlined style={{ fontSize: '30px' }} />}
        text='NEW JOB'
      />
      <StyledModal
        visible={visible}
        title='New Job'
        onCancel={onCancel}
        onOk={onCancel}
      >
        <Resizable
          defaultSize={{ width: '60%', height: '100%' }}
          maxWidth='80%'
          maxHeight='100%'
          style={{ border: '1px solid blue' }}
        >
          <NewJobForm />
        </Resizable>
        <div className='right'>
          <Resizable
            defaultSize={{ width: '100%', height: '50%' }}
            maxWidth='90%'
            maxHeight='90%'
            style={{ border: '1px solid green' }}
          >
            <div className='tips-and-hints'>
              <h1>TIP CONTAINER</h1>
            </div>
          </Resizable>
          <Resizable
            defaultSize={{ width: '100%', height: '50%' }}
            maxWidth='90%'
            maxHeight='90%'
            style={{ border: '1px solid red' }}
          >
            <div className='client-view'>
              <h1>CLIENT VIEW</h1>
            </div>
          </Resizable>
        </div>
      </StyledModal>
    </div>
  );
}

const StyledModal = styled(Modal)`
  width: 100% !important;

  .ant-modal-body {
    display: flex;

    form {
    }

    .right {
      margin: 0 30px;
      flex-grow: 1;

      .tips-and-hints {
      }

      .client-view {
      }
    }
  }
`;
