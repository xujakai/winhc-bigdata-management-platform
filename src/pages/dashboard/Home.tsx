import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Home: React.FC = () => {
  return (
    <div>
      <Title level={2}>首页</Title>
      <p>欢迎来到管理系统！</p>
    </div>
  );
};

export default Home;