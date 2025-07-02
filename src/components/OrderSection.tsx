import React, { useState, useEffect } from "react";
import { createOrder, getOrderList } from "../services/api";
import { Card, List, Button, message, Spin, Empty, Modal, Tag, Table } from "antd";
import { DeleteOutlined, ShoppingCartOutlined, PlusOutlined, MinusOutlined, DollarCircleFilled } from "@ant-design/icons";

interface OrderSectionProps {
  selectedProducts: any[];
  onOrderSuccess?: () => void;
  onRemoveProduct?: (productId: string) => void;
  onDecreaseQuantity?: (productId: string) => void;
  onIncreaseQuantity?: (productId: string) => void;
}

export default function OrderSection({ selectedProducts, onOrderSuccess, onRemoveProduct, onDecreaseQuantity, onIncreaseQuantity }: OrderSectionProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  
  useEffect(() => {
    getOrderList().then((res: any) => {
      setOrders(res.data || res);
      setLoading(false);
    });
  }, []);

  const handleOrder = async () => {
    try {
      setOrderLoading(true);
      const items = selectedProducts.map(p => ({
        productId: p.productId,
        productQuantity: p.quantity,
      }));
      const orderResult = await createOrder({ items });
      const newOrders: any = await getOrderList();
      setOrders(newOrders.data || newOrders);
      
      // Display detailed order success notification
      Modal.success({
        title: 'Order Placed Successfully! 🎉',
        content: (
          <div>
            <p><strong>Order ID:</strong> #{orderResult.id || 'N/A'}</p>
            <p><strong>Total Amount:</strong> ${orderResult.totalAmount || totalAmount.toFixed(2)}</p>
            <p><strong>Number of Items:</strong> {selectedProducts.length}</p>
            <p><strong>Status:</strong> <Tag color="green">Confirmed</Tag></p>
            <p>Thank you for your purchase! Your order will be processed soon.</p>
          </div>
        ),
        okText: 'Close',
        width: 500,
      });
      // Gọi callback reload ngay lập tức
      if (onOrderSuccess) onOrderSuccess();
    } catch (e: any) {
      console.error('Order error:', e);
      message.error(e.message || "Order failed");
    } finally {
      setOrderLoading(false);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    if (onRemoveProduct) {
      onRemoveProduct(productId);
      message.success('Product removed from cart');
    }
  };

  const handleDecreaseQuantity = (productId: string) => {
    if (onDecreaseQuantity) {
      onDecreaseQuantity(productId);
      message.success('Product quantity decreased');
    }
  };

  const handleIncreaseQuantity = (productId: string) => {
    if (onIncreaseQuantity) {
      onIncreaseQuantity(productId);
      message.success('Product quantity increased');
    }
  };

  const totalAmount = selectedProducts.reduce((sum, item) => {
    return sum + (item.unitPrice * item.quantity);
  }, 0);

  return (
    <div style={{ display: "flex", gap: 24, padding: "16px" }}>
      <Card title="Shopping Cart" style={{ flex: 1, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
        {selectedProducts.length === 0 ? (
          <Empty description="No items in cart" />
        ) : (
          <>
            <List
              dataSource={selectedProducts}
              renderItem={(item, index) => (
                <List.Item
                  style={{ alignItems: 'center', paddingLeft: 0, paddingRight: 0 }}
                  actions={[
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveProduct(item.productId)}
                      title="Remove product"
                    />
                  ]}
                >
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, flex: 2 }}>
                      <span style={{ fontWeight: 'bold', color: '#888', minWidth: 20 }}>{index + 1}.</span>
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: 2 }}>{item.productName}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          ${item.unitPrice} x {item.quantity}
                          {item.quantity >= item.productStock && (
                            <Tag color="orange" style={{ marginLeft: 8 }}>Max stock</Tag>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
                      <Button
                        type="text"
                        size="small"
                        icon={<MinusOutlined />}
                        onClick={() => handleDecreaseQuantity(item.productId)}
                        title="Decrease quantity"
                      />
                      <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>
                        {item.quantity}
                      </span>
                      <Button
                        type="text"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => handleIncreaseQuantity(item.productId)}
                        title="Increase quantity"
                        disabled={item.quantity >= item.productStock}
                      />
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#1890ff', whiteSpace: 'nowrap', marginLeft: 16, flex: 1, textAlign: 'right' }}>
                      ${ (item.unitPrice * item.quantity).toFixed(2) }
                    </div>
                  </div>
                </List.Item>
              )}
            />
            <div style={{ marginTop: 16, textAlign: "right" }}>
              <strong>Total: ${totalAmount.toFixed(2)}</strong>
            </div>
            <Button
              type="primary"
              onClick={handleOrder}
              loading={orderLoading}
              style={{ marginTop: 16, width: "100%" }}
              icon={<ShoppingCartOutlined />}
            >
              Place Order
            </Button>
          </>
        )}
      </Card>
      
      <Card title="Your Orders" style={{ flex: 2, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
        {loading ? (
          <Spin />
        ) : orders.length === 0 ? (
          <Empty description="No orders yet" />
        ) : (
          <Table
            dataSource={orders}
            rowKey="id"
            pagination={false}
            bordered
            columns={[
              {
                title: "ID",
                dataIndex: "id",
                key: "id",
                width: 80,
              },
              {
                title: "Created At",
                dataIndex: "createdAt",
                key: "createdAt",
                render: (date: string) => new Date(date).toLocaleString(),
              },
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (status: string) => (
                  <Tag color={status === 'PAID' ? 'green' : status === 'PENDING' ? 'orange' : 'red'} style={{ fontWeight: 'bold' }}>
                    {status}
                  </Tag>
                ),
              },
              {
                title: "Total",
                dataIndex: "totalAmount",
                key: "totalAmount",
                align: 'right',
                render: (total: number) => (
                  <Tag color="purple" style={{ fontWeight: 'bold', fontSize: 16 }} icon={<DollarCircleFilled />}>
                    {total}
                  </Tag>
                ),
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
} 