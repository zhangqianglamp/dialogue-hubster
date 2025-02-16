import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const navigate = useNavigate();
    
    useEffect(() => {
      // 这里检查用户是否已登录，具体实现取决于你的认证方案
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      
      if (!isAuthenticated) {
        navigate('/');
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
}; 