import React, { useEffect, useState } from 'react';
import { Alert, Layout } from 'antd';
import AppHeader from './AppHeader';
import UserInfo from './UserInfo';
import ProductList from './ProductList';
import OrderSection from './OrderSection';
import 'antd/dist/reset.css';
import { getMessage } from '../services/api';

const { Content } = Layout;

const Home: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [messageWelcome, setMessageWelcome] = useState("");

  useEffect(() => {
    getMessage().then((res) => {
      setMessageWelcome(res.data || res);
    });
  }
  , []);

  const handleSelectProduct = (product: any) => {
    setSelectedProducts(prev => {
      const exist = prev.find(p => p.productId === product.productId);
      if (exist) {
        return prev.map(p =>
          p.productId === product.productId
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  return (
    <Layout style={{ minHeight: '100vh', minWidth: '95vw' }}>
      <AppHeader />
      <Content style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
          <div style={{ flex: 1, display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <UserInfo />
            </div>
            <div style={{ flex: 2 }}>
              <ProductList onSelectProduct={handleSelectProduct} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <Alert message={messageWelcome} type="info" showIcon style={{ marginBottom: '16px' }} />
            <OrderSection selectedProducts={selectedProducts} />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Home; 