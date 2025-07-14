import React from 'react';
import Layout from '@/components/layout/Layout';
import LoginForm from '@/features/auth/components/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <Layout>
      <LoginForm />
    </Layout>
  );
};

export default LoginPage;