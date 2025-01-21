import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Profile: React.FC = () => {
  return (
    <div>
      <Title level={2}>个人信息</Title>
      <p>这里是您的个人信息页面。</p>
    </div>
  );
};

export default Profile;