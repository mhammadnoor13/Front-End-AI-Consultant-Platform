import React from 'react';
import Layout from '@/components/layout/Layout';
import SubmitCaseForm from '@/features/cases/components/SubmitCaseForm';

const SubmitCasePage: React.FC = () => {
  return (
    <Layout>
      <SubmitCaseForm />
    </Layout>
  );
};

export default SubmitCasePage;