// 基础引入
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { SubmitFormDTO } from '../api/form';
import { submitForm } from '../api/form';
import { majorData, organizationData } from '../utils/constants';
// 引入antd组件
import { Form, Input, Cascader, Radio, Button, Card, message } from 'antd';



const SubmitForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const onFinish = async (values: any) => {
    
    setLoading(true);

    try {
      // Antd 的 Cascader 返回的是数组，而后端要的是分开的字符串
      // 把 values 转换成符合 SubmitFormDTO 格式的数据    
      const payload: SubmitFormDTO = {
        studentId: values.studentId,
        name: values.name,
        qqNumber: values.qqNumber,
        phoneNumber: values.phoneNumber,
        major: values.major[0],
        className: values.major[1],

        firstOrganizationName: values.firstOrgAndBranch[0],
        firstBranch: values.firstOrgAndBranch[1],
        firstOrganizationReason: values.firstOrganizationReason,

        secondOrganizationName: values.secondOrgAndBranch?.[0],
        secondBranch: values.secondOrgAndBranch?.[1],
        secondOrganizationReason: values.secondOrganizationReason,

        isDispensing: values.isDispensing,
      };
      console.log('即将发送给后端的 Payload:', payload);
      
      // 提交表单
      await submitForm(payload);

      // 成功反馈
      message.success('报名成功!');
      form.resetFields();

    } catch (error) {
      // 错误提示在 request 拦截器中
      console.log('报名失败:', error);
    } finally {
      setLoading(false);
    }
  }



  return (
    <div className='flex justify-center py-4 min-h-screen bg-[#f0f2f5]'>
      <Card title='学生组织报名表' style={{ width: 700, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{isDispensing: true}}
        >
          {/* 基本信息 */}
          <Form.Item
            label="学号"
            name="studentId"
            rules={[
              { required: true, message: '请输入学号!' },
              { pattern: /^\d{8}$/, message: '请输入8位数字学号!' },
            ]}
          >
            <Input placeholder="请输入学号" />
          </Form.Item>

          <Form.Item
            label="姓名"
            name="name"
            rules={[
              { required: true, message: '请输入姓名!' },
              { pattern: /^[\u4e00-\u9fa5]{2,10}$/, message: '姓名必须为2-10个中文字符!' } // [\u4e00-\u9fa5] Unicode 表示所有中文字符
            ]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            label="QQ号"
            name="qqNumber"
            rules={[
              { required: true, message: '请输入QQ号!' },
              { pattern: /^\d{5,10}$/, message: '请输入5-10位数字QQ号!' }
            ]}
          >
            <Input placeholder="请输入QQ号" />
          </Form.Item>

          <Form.Item
            label="手机号"
            name="phoneNumber"
            rules={[
              { required: true, message: '请输入手机号!' },
              { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号!' }
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          
          {/* 专业信息 */}
          <Form.Item label="专业与班级" name="major" rules={[{ required: true, message: '请选择专业与班级!' }]}>
            <Cascader options={majorData} placeholder="请选择专业与班级" />
          </Form.Item>

          {/* 第一志愿信息 */}
          <Card type='inner' title='第一志愿信息' style={{ marginBottom: 16 }}>
            <Form.Item label="第一志愿组织" name="firstOrgAndBranch" rules={[{ required: true, message: '请选择第一志愿组织!' }]}>
              <Cascader options={organizationData} placeholder="请选择第一志愿组织" />
            </Form.Item>
            <Form.Item label="加入理由" name="firstOrganizationReason" rules={[{ required: true, message: '请输入加入理由!' }]}>
              <Input.TextArea rows={3} placeholder="请简单谈谈你为什么想加入我们" />
            </Form.Item>
          </Card>

          {/* 第二志愿信息 */}
          <Card type='inner' title='第二志愿信息' style={{ marginBottom: 16 }}>
            <Form.Item 
              label="第二志愿组织" 
              name="secondOrgAndBranch" 
              // dependencies声明依赖：告诉 Antd，只要第一志愿变了，这个第二志愿也要跟着重新校验一次
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
              <Cascader options={organizationData} placeholder="请选择第二志愿组织" />
            </Form.Item>
            <Form.Item label="加入理由" name="secondOrganizationReason" >
              <Input.TextArea rows={3} placeholder="请简单谈谈你为什么想加入我们" />
            </Form.Item>
          </Card>

          {/* 是否调剂 */}
          <Form.Item label="是否服从调剂" name="isDispensing" rules={[{ required: true, message: '请选择是否调剂!' }]} style={{ textAlign: 'left' }}>
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>

          {/* 提交按钮 */}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading} size="large" block>
              提交
            </Button>
          </Form.Item>
        </Form>
        <Button type="link" onClick={() => navigate('/')} size="large" block>
          返回
        </Button>
      </Card>
    </div>

  )
}

export default SubmitForm