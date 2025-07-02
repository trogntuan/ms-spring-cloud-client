import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import type { UserDto } from '../types';
import './Home.css';

const Home: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const [userInfo, setUserInfo] = useState<UserDto | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUserInfo = async () => {
    setApiLoading(true);
    setError('');
    
    try {
      const response = await apiService.getUserInfo();
      setUserInfo(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user info');
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-brand">
          <h1>OAuth2 Microservice Demo</h1>
        </div>
        <div className="nav-user">
          <span>Welcome, {user?.name || 'User'}!</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="content-card">
          <h2>User Information</h2>
          
          <div className="user-info-section">
            <h3>Current User (from Auth Context)</h3>
            {user && (
              <div className="user-details">
                <div className="info-row">
                  <span className="label">User ID:</span>
                  <span className="value">{user.userId}</span>
                </div>
                <div className="info-row">
                  <span className="label">Name:</span>
                  <span className="value">{user.name}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{user.email}</span>
                </div>
                <div className="info-row">
                  <span className="label">Phone:</span>
                  <span className="value">{user.phone}</span>
                </div>
                <div className="info-row">
                  <span className="label">Point Amount:</span>
                  <span className="value">{user.pointAmount}</span>
                </div>
                <div className="info-row">
                  <span className="label">Account ID:</span>
                  <span className="value">{user.accountId}</span>
                </div>
              </div>
            )}
          </div>

          <div className="api-section">
            <h3>API Call to User Service</h3>
            <p>This section calls the protected API endpoint: <code>localhost:8082/user-service/info</code></p>
            
            <button 
              onClick={fetchUserInfo} 
              disabled={apiLoading}
              className="refresh-button"
            >
              {apiLoading ? 'Loading...' : 'Refresh User Info'}
            </button>

            {error && (
              <div className="error-message">
                <strong>Error:</strong> {error}
              </div>
            )}

            {userInfo && (
              <div className="api-response">
                <h4>API Response:</h4>
                <div className="user-details">
                  <div className="info-row">
                    <span className="label">User ID:</span>
                    <span className="value">{userInfo.userId}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Name:</span>
                    <span className="value">{userInfo.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Email:</span>
                    <span className="value">{userInfo.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Phone:</span>
                    <span className="value">{userInfo.phone}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Point Amount:</span>
                    <span className="value">{userInfo.pointAmount}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Account ID:</span>
                    <span className="value">{userInfo.accountId}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="authorization-info">
            <h3>Authorization Details</h3>
            <div className="auth-details">
              <p><strong>Endpoint:</strong> <code>@PreAuthorize("hasAuthority('SCOPE_READ') && hasAnyRole('ADMIN','USER')")</code></p>
              <p><strong>Required Scopes:</strong> SCOPE_READ</p>
              <p><strong>Required Roles:</strong> ADMIN or USER</p>
              <p><strong>Authentication:</strong> OAuth2 Bearer Token</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home; 