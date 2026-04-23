import React, { useEffect } from 'react';
import { Modal, Form, Input, Cascader, Radio, message } from 'antd';
import { majorData, organizationData } from '../utils/constants';
import { submitForm } from '../api/form'; // 管理员编辑和学生提交用同一个api发送请求
import type { RegistrationRecord } from '../api/admin'; // 管理员端和学生端的注册记录类型共用

// 明确定义弹窗需要的 Props 
interface EditModalProps {
  open: boolean;                 // 控制是否显示弹窗
  onCancel: () => void;          // 告诉父组件：“我要关了”
  onSuccess: () => void;         // 告诉父组件：“我修改成功了，你刷新下表格吧”
  record: RegistrationRecord | null; // 要编辑的行数据
}

const EditModal: React.FC<EditModalProps> = ({ open, onCancel, onSuccess, record }) => {
  const [form] = Form.useForm();

  // 把原数据传给表单，显示在弹窗中
  useEffect(() => {
    if (open && record) {
      form.setFieldsValue({
        // 其他字段直接回填
        ...record,
        // 专业和班级字段需要转换为 数组 给 Cascader
        majorAndClass:[record.major, record.className],
        firstOrgAndBranch: [record.firstOrganizationName, record.firstBranch],
        secondOrgAndBranch: record.secondOrganizationName ? [record.secondOrganizationName, record.secondBranch] : [],
      });
    }
  }, [open, record, form]);

  // 把修改的数据提交给后端的逻辑 
  const handleOk = async () => {
    try {

      const values = await form.validateFields(); // 返回表单字段的键值对
      
      // 提交给后端的修改表单的数据清洗 （数组要转成单字符串）
      const payload = {
        studentId: values.studentId, 
        name: values.name,
        qqNumber: values.qqNumber,
        phoneNumber: values.phoneNumber,
        major: values.majorAndClass[0],
        className: values.majorAndClass[1],
        firstOrganizationName: values.firstOrgAndBranch[0],
        firstBranch: values.firstOrgAndBranch[1],
        firstOrganizationReason: values.firstOrganizationReason,
        secondOrganizationName: values.secondOrgAndBranch?.[0] || '',
        secondBranch: values.secondOrgAndBranch?.[1] || '',
        secondOrganizationReason: values.secondOrganizationReason || '',
        isDispensing: values.isDispensing,
      };

      await submitForm(payload); // 发请求
      message.success('修改成功！');
      
      onSuccess(); // 通知父组件刷新表格
      onCancel();  // 关闭弹窗
    } catch (error) {
      console.log('校验失败或请求错误', error);
    }
  };

  // 弹窗完全关闭后，清空表单残留数据
  const handleAfterClose = () => {
    form.resetFields();
  };

  return (
    <Modal
      title="修改学生报名信息"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      afterClose={handleAfterClose}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item label="学号(唯一标识 不可修改)" name="studentId">
          <Input disabled />
        </Form.Item>
        <Form.Item label="姓名" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="QQ号" name="qqNumber">
          <Input />
        </Form.Item>
        <Form.Item label="手机号" name="phoneNumber">
          <Input />
        </Form.Item>
        <Form.Item label="专业" name="majorAndClass">
          <Cascader options={majorData} />
        </Form.Item>
        <Form.Item label="专业与班级" name="major" rules={[{ required: true, message: '请选择专业与班级!' }]}>
          <Cascader options={majorData} placeholder="请选择专业与班级" />
        </Form.Item>
        {/* 第一志愿信息 */}
        <Form.Item label="第一志愿" name="firstOrgAndBranch">
          <Cascader options={organizationData} placeholder="请选择第一志愿" />
        </Form.Item>
        <Form.Item label="第一志愿原因" name="firstOrganizationReason">
          <Input />
        </Form.Item>
        {/* 第二志愿信息 */}
        <Form.Item label="第二志愿" name="secondOrgAndBranch"
          dependencies={['firstOrgAndBranch']}
          // 自定义rules函数限制第二志愿组织不能与第一志愿相同
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const firstOrg = getFieldValue('firstOrgAndBranch');
                // 如果第二志愿为空，直接通过验
                if (!value || value.length === 0) {
                   return Promise.resolve();
                }
                // 如果第二志愿与第一志愿相同，提示错误
                // 注意：不能直接比较数组，因为地址不同。可使用 join('') 方法将数组转换为字符串来比较
                if (firstOrg && value.join('') === firstOrg.join('')) {
                  return Promise.reject(new Error('第二志愿不能与第一志愿相同！'));
                }
                return Promise.resolve();
              },
             }),
           ]}
        >
          <Cascader options={organizationData} placeholder="请选择第二志愿" />
        </Form.Item>
        <Form.Item label="第二志愿原因" name="secondOrganizationReason">
          <Input />
        </Form.Item>
        {/* 是否调剂 */}
          <Form.Item label="是否服从调剂" name="isDispensing" style={{ textAlign: 'left' }}>
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;