import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const { login, loading } = useAuth();

  const handleLogin = () => {
    login();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>OAuth2 Authorization Code Flow</h2>
        <p className="login-description">
          Click the button below to authenticate with the OAuth2 server using Authorization Code flow.
        </p>
        
        <button 
          onClick={handleLogin} 
          disabled={loading} 
          className="login-button"
        >
          {loading ? 'Redirecting...' : 'Login with OAuth2'}
        </button>

        <div className="oauth-info">
          <h4>OAuth2 Configuration:</h4>
          <div className="config-details">
            <p><strong>Authorization Server:</strong> localhost:9000</p>
            <p><strong>Client ID:</strong> ipt</p>
            <p><strong>Redirect URI:</strong> http://localhost:3000/callback</p>
            <p><strong>Scopes:</strong> READ WRITE</p>
            <p><strong>Response Type:</strong> code</p>
          </div>
        </div>

        <div className="flow-info">
          <h4>Authorization Code Flow:</h4>
          <ol>
            <li>User clicks "Login with OAuth2"</li>
            <li>Redirect to OAuth2 authorization server</li>
            <li>User authenticates on OAuth2 server</li>
            <li>OAuth2 server redirects back with authorization code</li>
            <li>Frontend exchanges code for access token</li>
            <li>Access token used for API calls</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Login; 