import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Home: React.FC = () => {
  return (
    <div>
      <Title level={2}>Home Page</Title>
      <p>Welcome to the home page!</p>
    </div>
  );
};

export default Home;