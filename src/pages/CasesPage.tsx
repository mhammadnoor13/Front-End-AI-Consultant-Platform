import React from 'react';
import Layout from '@/components/layout/Layout';
import CasesList from '@/features/cases/components/CasesList';

const CasesPage: React.FC = () => {
  return (
    <Layout>
      <CasesList />
    </Layout>
  );
};

export default CasesPage;