import request from "../utils/request";

export interface SubmitFormDTO {
  studentId: string;
  name: string;
  qqNumber: string;
  phoneNumber: string;
  major: string;
  className: string;
  firstOrganizationName: string;
  firstBranch: string;
  firstOrganizationReason: string;
  secondOrganizationName?: string;
  secondBranch?: string;
  secondOrganizationReason?: string;
  isDispensing: boolean;
}

export const submitForm = async (data: SubmitFormDTO) => {
  return request.post('/user/forms', data);
}