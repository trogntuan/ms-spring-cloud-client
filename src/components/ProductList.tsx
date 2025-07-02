import { useEffect, useState } from "react";
import { Table, Button, Spin, Card, Tag, Tooltip } from "antd";
import { getProductList } from "../services/api";
import { DollarCircleFilled, ShoppingCartOutlined } from "@ant-design/icons";

interface ProductListProps {
  onSelectProduct: (product: any) => void;
  reloadTrigger?: number;
  selectedProducts?: any[];
}

export default function ProductList({ onSelectProduct, reloadTrigger = 0, selectedProducts = [] }: ProductListProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res: any = await getProductList();
      setProducts(res.data || res);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [reloadTrigger]);

  const getProductInCart = (productId: string) => {
    return selectedProducts.find(p => p.productId === productId);
  };

  const isMaxStockReached = (product: any) => {
    const productInCart = getProductInCart(product.productId);
    return productInCart && productInCart.quantity >= product.productStock;
  };

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
      render: (stock: number, record: any) => {
        const productInCart = getProductInCart(record.productId);
        const availableStock = stock - (productInCart?.quantity || 0);
        
        return (
          <div>
            <Tag color={availableStock > 0 ? "green" : "red"}>
              {availableStock > 0 ? `${availableStock}` : "Out of stock"}
            </Tag>
            {productInCart && (
              <Tag color="blue" style={{ marginLeft: "4px" }}>
                In cart: {productInCart.quantity}
              </Tag>
            )}
          </div>
        );
      }
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => {
        const isMaxStock = isMaxStockReached(record);
        const productInCart = getProductInCart(record.productId);
        const availableStock = record.productStock - (productInCart?.quantity || 0);
        
        return (
          <Tooltip 
            title={isMaxStock ? "Maximum quantity reached in cart" : 
                   availableStock <= 0 ? "Out of stock" : "Add to cart"}
          >
            <Button 
              icon={<ShoppingCartOutlined />}
              type="dashed" 
              onClick={() => onSelectProduct(record)}
              disabled={record.productStock <= 0 || isMaxStock}
            >
              {isMaxStock ? "Max Stock" : "Add to Cart"}
            </Button>
          </Tooltip>
        );
      },
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