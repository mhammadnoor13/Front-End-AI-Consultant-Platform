import React from 'react';
import Layout from '@/components/layout/Layout';
import CaseDetailView from '@/features/cases/components/CaseDetailView';

const CaseDetailPage: React.FC = () => {
  return (
    <Layout>
      <CaseDetailView />
    </Layout>
  );
};

export default CaseDetailPage;