import { fetchRegistrationForms } from '../api/admin';
import type { RegistrationRecord } from '../api/admin';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Table, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/es/table'; // 引入 ColumnsType 类型，定义表格列的类型
import { UserOutlined, LogoutOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';



const { Header, Sider, Content } = Layout;
const { confirm } = Modal;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // 基本状态管理
  const [loading, setLoading] = useState(false);
  const[FormList, setFormList] = useState<RegistrationRecord[]>([]);
  // 分页状态管理
  const [currentPage, setCurrentPage] = useState(1);
  const[pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // 定义表格的列
  const columns: ColumnsType<RegistrationRecord> =[
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60, fixed: 'left',align:'center' },
    { title: '姓名', dataIndex: 'name', key: 'name', width: 120, fixed: 'left',align:'center' },
    { title: '学号', dataIndex: 'studentId', key: 'studentId', width: 120,align:'center' },
    { title: '专业', dataIndex: 'major', key: 'major', width: 150,align:'center' },
    { title: '班级', dataIndex: 'className', key: 'className', width: 120,align:'center' },
    { title: '第一志愿', dataIndex: 'firstOrganizationName', key: 'firstOrganizationName', width: 120,align:'center' },
    { title: '第一部门', dataIndex: 'firstBranch', key: 'firstBranch', width: 120,align:'center' },
    { title: '第二志愿', dataIndex: 'secondOrganizationName', key: 'secondOrganizationName', width: 120,align:'center' },
    { title: '第二部门', dataIndex: 'secondBranch', key: 'secondBranch', width: 120,align:'center' },
    { 
      title: '调剂', 
      dataIndex: 'isDispensing', 
      key: 'isDispensing', 
      width: 80,
      align:'center',
      // 把布尔值变成标签icon
      render: (text: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${text ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {text ? '是' : '否'}
        </span>
      )
    },
  ];

  // 加载数据的核心函数
const loadData = async (page: number, size: number) => {
    setLoading(true);
    try {
      // 这里的 res 实际上是拦截器脱壳后的业务对象
      // 它包含了 { code, message, data: { Total, FormList } }
      const res: any = await fetchRegistrationForms({ pageNo: page, pageSize: size });
      
      // 🌟 核心修正：从 res.data 中取出真实的字段名！
      const actualData = res.data; 
      
      if (actualData) {
        // 使用 || [] 防止 FormList 不存在时报错
        setFormList(actualData.FormList || []); 
        // 使用 ?? 0 防止 Total 为 null 或 undefined
        setTotalCount(actualData.Total ?? 0); 
      }
      
    } catch (error) {
      // 这里的错误已经在拦截器里弹窗了，我们只在控制台打印
      console.error('获取表格数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 监听页码变化，自动拉取新数据
  useEffect(() => {
    loadData(currentPage, pageSize);
  }, [currentPage, pageSize]); // 当 currentPage 或 pageSize 改变时，重新触发


  // 登出逻辑
  const handleLogout = () => {
    confirm({
      title: '确认退出登录吗？',
      icon: <ExclamationCircleFilled />,
      onOk() {
        localStorage.removeItem('token');
        navigate('/admin/login', { replace: true }); // 退出登录后，跳转到登录页，替换当前路由(避免通过回退返回当前页)
        message.success('退出登录成功');
      },
    });
  };

  return (
    <Layout className="min-h-screen">
      
      {/* 左侧边栏 */}
      <Sider breakpoint="lg" collapsedWidth="0" className="bg-slate-900">
        <div className="h-8 m-4 bg-white/20 rounded-md flex items-center justify-center text-white font-bold tracking-wider">
          SIPC ADMIN
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} className="bg-slate-900" items={[{ key: '1', icon: <UserOutlined />, label: '报名学生信息' }]} />
      </Sider>

      <Layout className="flex flex-col">
        {/* 右侧主体内容 */}
        <Content className="flex-1 overflow-auto">

          {/* 右侧头部 */}
          <Header className="sticky top-0 z-10 h-16 px-6 bg-white flex justify-between items-center shadow-sm">
            <h2 className="m-0 text-lg font-bold text-gray-700">学生信息管理</h2>
            <Button type="text" danger icon={<LogoutOutlined />} onClick={handleLogout} className="font-medium hover:bg-red-50">
              退出登录
            </Button>
          </Header>          
          {/* 右侧内容 */}
          <div className="p-6 h-full bg-white rounded-xl shadow-sm border border-gray-100">
            
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">最新报名列表</h3>
              {/* ！！！这里预留给未来的“模糊搜索”输入框 */}
            </div>

            {/* Antd 数据表格 */}
            <Table 
              columns={columns} 
              dataSource={FormList} 
              rowKey="id" // 告诉表格用哪个字段作为 React 的 key
              loading={loading} // 传入 loading 状态，Antd 会自动覆盖一个绝美的加载动画
              scroll={{ x: 900 }} 
              pagination={{
                // 将 Antd 的分页器和我们自己的 State 绑定
                current: currentPage,
                pageSize: pageSize,
                total: totalCount,
                showSizeChanger: true, // 允许用户切换每页条数
                // 当用户点击页码时触发
                onChange: (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                }
              }}
            />

          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;