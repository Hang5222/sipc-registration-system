// 引入页面
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import SubmitForm from './pages/SubmitForm'

// 引入工具
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SubmitForm />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App