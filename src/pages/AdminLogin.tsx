import React, { useState } from 'react'
import { Card, Form, Input, message, Button } from 'antd'
import type { AdminLoginValues } from '../api/admin';
import { adminLogin } from '../api/admin';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: AdminLoginValues) => {
    setLoading(true);
    try {
      
      console.log(values);
      const res: any = await adminLogin(values);
      
      if (res && res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        message.success('登录成功！欢迎回来');
        
        navigate('/admin/dashboard'); 
      } else {
        message.error(res.message || '登录失败，请检查账号密码');
      }
    } catch (error: any) {
      // 错误已经在拦截器里通过 message.error 弹出了，这里不需重复弹窗
      console.log(error); 
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='flex justify-center items-center py-4 min-h-screen bg-[#f0f2f5]'>
      <Card title='管理员登录' style={{ width: 700, height: 400, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item label="管理员账号" name="userName" rules={[{ required: true, message: '请输入管理员账号!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="管理员密码" name="password" rules={[{ required: true, message: '请输入管理员密码!' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" style={{ marginTop: 18 }} loading={loading} disabled={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default AdminLogin
