import { Button } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';


export default function AppHeader() {
  const { user, logout } = useAuth();
  
  return (
    <nav className="navbar">
        <div className="nav-brand">
          <h1>Microservice with Spring Cloud - Project Sample</h1>
        </div>
        <div className="nav-user">
          <span>Welcome, {user?.name || 'User'}!</span>
          <Button onClick={logout} type="dashed">
            Logout
          </Button>
        </div>
      </nav>
  );
} 