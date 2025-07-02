import React, { useState, useEffect } from "react";
import { createOrder, getMessage, getOrderList } from "../services/api";
import { Card, List, Button, message, Spin, Empty, Alert } from "antd";

export default function OrderSection({ selectedProducts }: { selectedProducts: any[] }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  
  useEffect(() => {
    getOrderList().then((res) => {
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
      await createOrder({ items });
      message.success("Order placed successfully!");
      const newOrders = await getOrderList();
      setOrders(newOrders.data || newOrders);
    } catch (e: any) {
      message.error(e.message || "Order failed");
    } finally {
      setOrderLoading(false);
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
              renderItem={item => (
                <List.Item>
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <span>{item.productName} x {item.quantity}</span>
                    <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
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
          <List
            dataSource={orders}
            renderItem={order => (
              <List.Item>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <span>Order #{order.id}</span>
                  <span>{order.status}</span>
                  <span>${order.totalAmount}</span>
                </div>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
} 