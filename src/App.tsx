// 引入页面（不使用懒加载）
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import SubmitForm from './pages/SubmitForm'
import WelcomePage from './pages/WelcomePage'

// 引入工具
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute' // 引入路由守卫组件

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/submit" element={<SubmitForm />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
