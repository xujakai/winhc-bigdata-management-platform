import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Settings: React.FC = () => {
  return (
    <div>
      <Title level={2}>Settings Page</Title>
      <p>Manage your settings here.</p>
    </div>
  );
};

export default Settings;