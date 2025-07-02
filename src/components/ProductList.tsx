import { useEffect, useState } from "react";
import { Table, Button, Spin, Card, Tag } from "antd";
import { getProductList } from "../services/api";
import { DollarCircleFilled, ShoppingCartOutlined } from "@ant-design/icons";

export default function ProductList({ onSelectProduct }: { onSelectProduct: (product: any) => void }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductList().then((res) => {
      setProducts(res.data || res);
      setLoading(false);
    });
  }, []);

  const columns = [
    { 
      title: "Name", 
      dataIndex: "productName",
      key: "productName"
    },
    { 
      title: "Price", 
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price: number) => (<Tag color="purple" icon={<DollarCircleFilled />}>{price}</Tag>)
    },
    { 
      title: "Stock", 
      dataIndex: "productStock",
      key: "productStock",
      render: (stock: number) => (
        <Tag color={stock > 0 ? "green" : "red"}>
          {stock > 0 ? `${stock}` : "Out of stock"}
        </Tag>
      )
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Button 
          icon={<ShoppingCartOutlined />}
          type="dashed" 
          onClick={() => onSelectProduct(record)}
          disabled={record.productStock <= 0}
        >
          Add to Cart
        </Button>
      ),
    },
  ];

  if (loading) return <Spin />;

  return (
    <Card title="Product List" style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
      <Table
      dataSource={products}
      columns={columns}
      rowKey="productId"
      pagination={false}
      style={{ margin: "0 0px" }}
    />
    </Card>
  );
} 