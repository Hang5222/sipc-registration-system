import request from "../utils/request";


// 管理员登录接口


export interface AdminLoginValues {
  userName: string
  password: string
}
export const adminLogin = async (data: AdminLoginValues) => {
  return request.post('/admin/auth/login', null, {
    params: data
  });// ！！文档要求用params，真正开发写 JSON body
}


// 分页获取报名表


// 请求参数
export interface FetchFormsParams {
  pageNo: number
  pageSize: number
}
// 单条响应数据
export interface RegistrationRecord {
  id: number
  studentId: string
  name: string
  qqNumber: string
  phoneNumber: string
  major: string
  className: string
  firstOrganizationName: string
  firstBranch: string
  firstOrganizationReason: string
  secondOrganizationName?: string
  secondBranch?: string
  secondOrganizationReason?: string
  isDispensing: boolean
}
// 后端返回数据
export interface PaginatedResponse {
  Total: number
  FormList: RegistrationRecord[]
}
export const fetchRegistrationForms = async (params: FetchFormsParams): Promise<PaginatedResponse> => {
  const response = await request.get<any, PaginatedResponse>('/admin/api/forms', { params });
  return response;
};