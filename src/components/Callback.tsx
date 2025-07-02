import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Callback.css';

const Callback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { handleCallback, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isProcessing) return;

    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (errorParam) {
      setError(errorDescription || 'Authorization failed');
      return;
    }

    if (!code) {
      setError('No authorization code received');
      return;
    }

    setIsProcessing(true);

    const processCallback = async () => {
      try {
        await handleCallback(code);
        navigate('/home');
      } catch (err: any) {
        console.error('Callback processing failed:', err);
        setError(err.response?.data?.error_description || 'Failed to exchange code for token');
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="callback-container">
        <div className="callback-card">
          <div className="loading-spinner"></div>
          <h3>Processing Authorization...</h3>
          <p>Please wait while we complete your authentication.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="callback-container">
        <div className="callback-card error">
          <h3>Authentication Failed</h3>
          <p className="error-message">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setIsProcessing(false);
              navigate('/login');
            }} 
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="callback-container">
      <div className="callback-card">
        <div className="loading-spinner"></div>
        <h3>Redirecting...</h3>
        <p>Authentication successful! Redirecting to home page.</p>
      </div>
    </div>
  );
};

export default Callback; 