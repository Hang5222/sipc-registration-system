import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Table, Modal, message, Space, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table'; 
import { UserOutlined, LogoutOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { fetchRegistrationForms, deleteRegistrationForm, searchRegistrationForms } from '../api/admin';
import type { RegistrationRecord } from '../api/admin';
import EditModal from '../components/EditModal';

const { Header, Sider, Content } = Layout;
const { confirm } = Modal;
const { Search } = Input;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理

  // 编辑弹窗状态管理
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RegistrationRecord | null>(null);
  // 表格状态管理
  const [loading, setLoading] = useState(false);
  const [FormList, setFormList] = useState<RegistrationRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 定义列的形状
  const columns: ColumnsType<RegistrationRecord> =[
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60, fixed: 'left', align: 'center' },
    { title: '姓名', dataIndex: 'name', key: 'name', width: 80, fixed: 'left', align: 'center' },
    { title: '学号', dataIndex: 'studentId', key: 'studentId', width: 100, align: 'center' },
    { title: '专业', dataIndex: 'major', key: 'major', width: 140, align: 'center' },
    { title: '班级', dataIndex: 'className', key: 'className', width: 90, align: 'center' },
    { title: '第一志愿', dataIndex: 'firstOrganizationName', key: 'firstOrganizationName', width: 120, align: 'center' },
    { title: '第一部门', dataIndex: 'firstBranch', key: 'firstBranch', width: 100, align: 'center' },
    { title: '第二志愿', dataIndex: 'secondOrganizationName', key: 'secondOrganizationName', width: 120, align: 'center' },
    { title: '第二部门', dataIndex: 'secondBranch', key: 'secondBranch', width: 100, align: 'center' },
    { 
      title: '调剂', 
      dataIndex: 'isDispensing', 
      key: 'isDispensing', 
      width: 70,
      align: 'center',
      render: (text: boolean) => (
        <span className={`px-2 py-1 rounded-md text-[10px] md:text-xs font-bold ${text ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
          {text ? '是' : '否'}
        </span>
      )
    },
    { 
      title: '操作', 
      key: 'actionDelete', 
      width: 100, 
      align: 'center', 
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="text" size="small" className="text-blue-500 hover:bg-blue-50 px-1" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" size="small" danger className="hover:bg-red-50 px-1" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      )
    },
  ];

  // ... 加载数据、useEffect、搜索、登出、删除等逻辑函数保持不变 ...
  const loadData = async (page: number, size: number, keyword: string) => {
    setLoading(true);
    try {
      const res: any = keyword.trim() 
        ? await searchRegistrationForms({ keyWord: keyword, pageNo: page, pageSize: size }) 
        : await fetchRegistrationForms({ pageNo: page, pageSize: size });
      
      const actualData = res.data; 
      if (actualData) {
        setFormList(actualData.FormList ||[]); 
        setTotalCount(actualData.Total ?? 0); 
      }
    } catch (error) {
      console.error('获取表格数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(currentPage, pageSize, searchKeyword); }, [currentPage, pageSize, searchKeyword]);

  const handleSearch = (keyword: string) => { setSearchKeyword(keyword); setCurrentPage(1); };
  const handleEdit = (record: RegistrationRecord) => { setEditingRecord(record); setIsModalOpen(true); };

  const handleDelete = (id: number) => {
    confirm({
      title: '确认删除?',
      content: '删除后相关数据无法恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteRegistrationForm(id);
          message.success('删除成功！');
          loadData(currentPage, pageSize, searchKeyword);
        } catch (error) { console.error('删除失败', error); }
      },
    });
  };

  const handleLogout = () => {
    confirm({
      title: '退出登录?',
      okText: '退出',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        localStorage.removeItem('token');
        navigate('/admin/login', { replace: true });
        message.success('已安全退出');
      },
    });
  };

  return (
    // 外层容器：确保在移动端也能正常滚动
    <Layout className="h-screen overflow-hidden bg-[#f4f6f9]">
      
      <Sider breakpoint="lg" collapsedWidth="0" className="bg-[#001529] shadow-xl z-20">
        <div className="h-10 m-3 bg-white/10 rounded-lg flex items-center justify-center text-white font-black tracking-widest text-sm md:text-lg">
          SIPC
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} className="bg-[#001529]" items={[{ key: '1', icon: <UserOutlined />, label: '学生报名管理' }]} />
      </Sider>

      {/* 🌟 修复 flex 溢出问题：加入 min-w-0 */}
      <Layout className="bg-[#f4f6f9] flex flex-col min-w-0">
        
        {/* 头部：移动端减小 padding 和字体 */}
        <Header className="bg-white/80 backdrop-blur-md border-b border-gray-200 h-14 md:h-16 px-4 md:px-6 flex justify-between items-center shadow-sm z-10 shrink-0">
          <h2 className="m-0 text-base md:text-lg font-extrabold text-slate-700 tracking-wide truncate nowrap">学生信息控制台</h2>
          <Button type="text" danger icon={<LogoutOutlined />} onClick={handleLogout} className="font-semibold hover:bg-red-50 rounded-lg text-xs md:text-sm px-2 md:px-4">
             <span className="hidden sm:inline">退出系统</span>
          </Button>
        </Header>          

        {/* 🌟 内容区：修复移动端被吃掉的分页器 */}
        <Content className="p-2 md:p-6 flex flex-col h-full overflow-hidden">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
            
            {/* 表格工具栏：移动端改为纵向排列，减小边距 */}
            <div className="p-3 md:p-5 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
              <h3 className="w-32 text-lg md:text-xl font-bold text-slate-800 m-0 border-l-4 border-blue-500 pl-2 md:pl-3">数据总览</h3>
              <Search
                placeholder="输入关键字搜索..."
                allowClear
                enterButton={<Button type="primary" className="bg-blue-500">检索</Button>}
                size="large"
                onSearch={handleSearch}
                className="w-full sm:w-80 shadow-sm"
              />
            </div>

            {/* 表格主体 */}
            <div className="flex-1 overflow-auto p-2 md:p-4 pt-0">
              <Table 
                columns={columns} 
                dataSource={FormList} 
                rowKey="id" 
                loading={loading}
                size="medium" 
                // scroll x 设为 max-content，保证在手机上也能完整横向滑动展示
                scroll={{ x: 'max-content' }} 
                className="custom-table"
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalCount,
                  showSizeChanger: true,
                  size: "middle", 
                  showTotal: (total) => <span className="hidden sm:inline">共 {total} 条</span>, // 移动端隐藏总条数，省空间
                  onChange: (page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                  }
                }}
              />
            </div>

            <EditModal 
              open={isModalOpen}
              record={editingRecord}
              onCancel={() => setIsModalOpen(false)}
              onSuccess={() => loadData(currentPage, pageSize, searchKeyword)} 
            />

          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;