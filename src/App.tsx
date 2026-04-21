// 引入页面
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import SubmitForm from './pages/SubmitForm'
import WelcomePage from './pages/WelcomePage'

// 引入工具
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/submit" element={<SubmitForm />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App