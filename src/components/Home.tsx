import React, { useEffect, useState } from 'react';
import { Alert, Layout } from 'antd';
import AppHeader from './AppHeader';
import UserInfo from './UserInfo';
import ProductList from './ProductList';
import OrderSection from './OrderSection';
import 'antd/dist/reset.css';
import { getMessage } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const { Content } = Layout;

const Home: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [messageWelcome, setMessageWelcome] = useState("");
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { loadUser } = useAuth();

  useEffect(() => {
    getMessage().then((res: any) => {
      setMessageWelcome(res.data || res);
    });
  }, []);

  const handleSelectProduct = (product: any) => {
    setSelectedProducts(prev => {
      const exist = prev.find(p => p.productId === product.productId);
      if (exist) {
        if (exist.quantity >= product.productStock) {
          return prev;
        }
        return prev.map(p =>
          p.productId === product.productId
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleIncreaseQuantity = (productId: string) => {
    setSelectedProducts(prev => {
      return prev.map(p => {
        if (p.productId === productId) {
          if (p.quantity >= p.productStock) {
            return p;
          }
          return { ...p, quantity: p.quantity + 1 };
        }
        return p;
      });
    });
  };

  const handleDecreaseQuantity = (productId: string) => {
    setSelectedProducts(prev => {
      const updated = prev.map(p => {
        if (p.productId === productId) {
          if (p.quantity <= 1) {
            return null;
          }
          return { ...p, quantity: p.quantity - 1 };
        }
        return p;
      }).filter(Boolean);
      return updated;
    });
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.productId !== productId));
  };

  const handleOrderSuccess = () => {
    setReloadTrigger(prev => prev + 1);
    setSelectedProducts([]);
    loadUser();
  };

  return (
    <Layout style={{ minHeight: '100vh', minWidth: '95vw' }}>
      <AppHeader />
      <Content style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
          <div style={{ flex: 1, display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <UserInfo reloadTrigger={reloadTrigger} />
            </div>
            <div style={{ flex: 2 }}>
              <ProductList 
                onSelectProduct={handleSelectProduct} 
                reloadTrigger={reloadTrigger}
                selectedProducts={selectedProducts}
              />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <Alert message={messageWelcome} type="info" showIcon style={{ marginBottom: '16px' }} />
            <OrderSection 
              selectedProducts={selectedProducts} 
              onOrderSuccess={handleOrderSuccess}
              onRemoveProduct={handleRemoveProduct}
              onDecreaseQuantity={handleDecreaseQuantity}
              onIncreaseQuantity={handleIncreaseQuantity}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Home; 