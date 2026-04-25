import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormOutlined, SafetyCertificateOutlined, RightOutlined } from '@ant-design/icons';
import logoFull from '../images/SIPC-logo.png';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#f8fafc] flex flex-col font-sans overflow-hidden">

      <header className="absolute top-0 left-0 w-full px-8 py-8 md:px-16 md:py-10 z-10 flex justify-between items-center">
        <img 
          src={logoFull} 
          alt="SIPC Logo" 
          className="h-10 md:h-12 object-contain"
        />
        <div className="hidden md:flex text-slate-400 text-sm font-medium tracking-widest uppercase">
          <p>TIANJIN UNIVERSITY OF TECHNOLOGY</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 z-10 w-full max-w-6xl mx-auto mt-16 md:mt-0">
        
        <h2 className="text-sm md:text-xl font-bold text-slate-500 tracking-[0.3em] uppercase mb-4 text-center">
          计算机科学与工程学院
        </h2>
        
        <h1 className="text-4xl md:text-7xl lg:text-[5rem] font-black text-slate-800 tracking-tight text-center leading-tight mb-16">
          学生组织<span className="text-[#1963a6]">报名系统</span>
        </h1>

        {/* 操作按钮组 */}
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-6 sm:gap-8">
          
          {/* C端入口 */}
          <button 
            onClick={() => navigate('/submit')}
            className="group relative flex items-center justify-center h-16 sm:h-18 px-10 sm:px-14 bg-[#1963a6] text-white rounded-xl text-lg sm:text-xl font-bold overflow-hidden shadow-[0_10px_40px_-10px_rgba(25,99,166,0.6)] hover:shadow-[0_15px_50px_-10px_rgba(25,99,166,0.8)] hover:-translate-y-1 transition-all duration-300"
          >
            <FormOutlined className="mr-3 text-2xl" />
            <span>学生报名入口</span>
            <RightOutlined className="ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </button>

          {/* B端入口 */}
          <button 
            onClick={() => navigate('/admin/login')}
            className="group flex items-center justify-center h-16 sm:h-18 px-10 sm:px-14 bg-white text-[#1963a6] border-2 border-slate-200 hover:border-[#1963a6] rounded-xl text-lg sm:text-xl font-bold shadow-sm hover:bg-[#f8fbff] hover:-translate-y-1 transition-all duration-300"
          >
            <SafetyCertificateOutlined className="mr-3 text-2xl text-slate-400 group-hover:text-[#1963a6] transition-colors" />
            <span>管理员后台入口</span>
          </button>

        </div>
      </main>

      
      <footer className="w-full py-8 text-center text-slate-400 text-sm font-medium z-10">
        © {new Date().getFullYear()} Hang
      </footer>
      
    </div>
  );
};

export default WelcomePage;