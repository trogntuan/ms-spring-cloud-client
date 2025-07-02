import React, { useEffect, useState } from "react";
import { Card, Descriptions, Spin, Tag } from "antd";
import { getUserInfo } from "../services/api";
import { DollarCircleFilled } from "@ant-design/icons";

export default function UserInfo() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserInfo().then((res) => {
      setUser(res.data || res); // fix trường hợp trả về {data: ...}
      setLoading(false);
    });
  }, []);

  if (loading) return <Spin />;

  if (!user) return <div>No user info</div>;

  return (
    <Card title="User Information" style={{ maxWidth: 350, margin: "0 auto", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
      <Descriptions column={1} bordered style={{ fontSize: 14, padding: 6 }}>
        <Descriptions.Item label="Name"><Tag>{user.name}</Tag></Descriptions.Item>
        <Descriptions.Item label="Email"><Tag>{user.email}</Tag></Descriptions.Item>
        <Descriptions.Item label="Phone"><Tag>{user.phone}</Tag></Descriptions.Item>
        <Descriptions.Item label="Points"><Tag style={{fontSize: 18, padding: 8, fontWeight: "bold"}} color="red" icon={<DollarCircleFilled />}>{user.pointAmount}</Tag></Descriptions.Item>
      </Descriptions>
    </Card>
  );
} 