import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Profile: React.FC = () => {
  return (
    <div>
      <Title level={2}>Profile Page</Title>
      <p>This is your profile page.</p>
    </div>
  );
};

export default Profile;