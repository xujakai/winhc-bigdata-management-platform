import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { routes, getMenuItems } from '../routes/config';
import { Flex } from 'antd';
const { Header, Sider, Content, Footer } = Layout;

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = getMenuItems(routes);

  return (
    <Flex gap="middle" wrap style={
      {
        height: '100vh',
      }
    }>

      <Layout style={{ minHeight: '100vh' }}>
        <Layout>
          <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={({ key }) => navigate(key)}
            />
          </Sider>
          <Layout>
            <Header style={{ padding: 0, background: '#fff' }} />
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
              <React.Suspense fallback={<div>Loading...</div>}>
                <Outlet />
              </React.Suspense>
            </Content>
          </Layout>

        </Layout>
      </Layout>

      {/* <Footer style={{ textAlign: "center", padding: "10px 50px" }}>
        <div>Copyright © 2024 | Powered by <Link target="_blank" to="https://winhc.cn">赢火虫</Link>
        </div>
      </Footer> */}
    </Flex>
  );
}

export default AppLayout;