import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { message } from 'antd';

interface ProtectedRouteProps {
  children: React.ReactNode; // 表示受保护的页面组件
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation(); // 获取当前路由信息
  const token = localStorage.getItem('token');

  // 使用 setTimeout 确保在渲染完成后再显示消息
  if (!token) {
    setTimeout(() => {
      message.error('请先登录后再访问该页面');
    }, 0);
    
    // 未登录，重定向到登录页，并记录当前路径以便登录后跳转回来
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
