# SIPC 学生组织报名管理系统 ( sipc-registration-system )

基于 React 18 + TypeScript + Ant Design 开发的高校学生组织报名与后台管理系统。
本项目涵盖了 C 端报名表信息收集与 B 端数据控制。

## 核心特性

### C 端：学生报名表
*   表单收集：基于 Antd Form 构建多种类信息收集表单，包含基础信息、级联选择（专业班级、组织部门）等。
*   联动与防呆校验：使用 Antd Form 自带 rules 实现必填数据。使用 dependencies 依赖与自定义校准函数实现校验前端（如“第二志愿不能与第一志愿相同”）。
*   数据清洗转换 (DTO)：在提交阶段拦截 UI 状态，将级联数组等前端便捷状态清洗并重组为后端严格要求的 JSON Payload。

### B 端：管理控制台
*   安全鉴权机制：实现登录 Token 拦截与存储。配合 Axios 请求拦截器，实现自动化鉴权。
*   UI 与 响应式布局：基于 Ant Design 组件库和部分 Tailwind CSS 构建响应式布局，支持移动端/PC端。

## 技术栈
*   核心框架： React 18
*   开发语言： TypeScript
*   构建工具： Vite
*   路由管理： React Router DOM
*   UI 样式： Ant Design, Tailwind CSS
*   网络请求： Axios

## 开发过程中的 AI 使用情况
*   项目中 AI 主要用途为整体思路引导以及问答纠错（如：没有思路的地方，提供基础代码框架以及核心功能的TODO布置；做部分 Code Review）
*   部分 UI 设计实现有对 AI 进行参考（如：优化响应式布局以及欢迎页的设计）