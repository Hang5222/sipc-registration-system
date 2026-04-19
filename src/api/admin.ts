import request from "../utils/request";

export interface AdminLoginValues {
  userName: string
  password: string
}

export const adminLogin = async (data: AdminLoginValues) => {
  return request.post('/admin/auth/login', null, {
    params: data
  });// ！！文档要求用params，真正开发写 JSON body
}