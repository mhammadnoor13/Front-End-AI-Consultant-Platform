import React from 'react';
import Layout from '@/components/layout/Layout';
import UploadReferences from '@/features/references/components/UploadReferences';

const ReferencesPage: React.FC = () => {
  return (
    <Layout>
      <UploadReferences />
    </Layout>
  );
};

export default ReferencesPage;