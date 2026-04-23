import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, SettingOutlined } from '@ant-design/icons'; 

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    // 整体背景：极浅的蓝灰背景，配合微弱的网格纹理（通过简单的 css 实现极客感）
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
      
      {/* 装饰性背景光晕 (绝对定位，增加空间感)
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div> */}

      <div className="z-10 text-center px-4 max-w-3xl">
        
        {/* 头部标题区 */}
        <div className="mb-12 space-y-4">
          <p className="text-blue-600 font-bold tracking-wider text-sm md:text-base uppercase">
            天津理工大学计算机科学与工程学院
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight">
            学生组织报名系统
          </h1>
        </div>

        {/* 按钮区 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
          
          {/* 主按钮：学生报名 */}
          <button
            onClick={() => navigate('/submit')}
            className="group relative flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300"
          >
            <UserOutlined className="text-xl group-hover:scale-110 transition-transform" />
            <span>学生报名入口</span>
          </button>

          {/* 次按钮：管理员登录 */}
          <button
            onClick={() => navigate('/admin/login')}
            className="group flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-white text-slate-600 font-semibold rounded-xl border-2 border-slate-200 hover:border-slate-400 hover:text-slate-800 hover:-translate-y-1 transition-all duration-300"
          >
            <SettingOutlined className="text-xl group-hover:rotate-90 transition-transform duration-500" />
            <span>管理员后台入口</span>
          </button>

        </div>
      </div>

      {/* 底部版权信息 */}
      <div className="absolute bottom-6 text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} Hang
      </div>
    </div>
  );
};

export default WelcomePage;