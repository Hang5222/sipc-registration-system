import axios from "axios";
import { message } from "antd";

// 拦截器
// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'https://frontest.sipc115.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = token; // 文档原文：Authorization: <token>
    }
    return config;
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data;

    // res.code业务状态码判断
    // 成功
    if (res.code === '200' || res.code === 200) {
      return res
    }
    // 失败
    if (res.code === 'A0400') {
      message.error(`参数错误(A0400): ${res.message || '请检查表单'}`);
    }
    else if (res.code === 'A0500') {
      message.error(`服务器错误(A0500): ${res.message || '请联系管理员'}`);
    }
    else {
      message.error(res.msg || '未知错误');
    }
    return Promise.reject(new Error(res.message || 'Error')); // 虽然 HTTP 是 200，但业务失败了。手动把它转化成一个 Promise 拒接状态
  },

  (error) => {
    // 处理http错误
    if (error.response) {
       message.error(`网络请求错误: HTTP ${error.response.status}`);
    } else if (error.request) {
      message.error('网络连接失败，请检查网络设置或稍后重试');
    } else {
      message.error('未知错误');
    }
    return Promise.reject(error);
  }
)

export default request;
