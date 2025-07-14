import React from 'react';
import Layout from '@/components/layout/Layout';
import RegisterForm from '@/features/auth/components/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <Layout>
      <RegisterForm />
    </Layout>
  );
};

export default RegisterPage;