import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Settings: React.FC = () => {
  return (
    <div>
      <Title level={2}>系统设置</Title>
      <p>在这里管理系统设置。</p>
    </div>
  );
};

export default Settings;