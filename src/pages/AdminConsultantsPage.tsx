import React from 'react';
import Layout from '@/components/layout/Layout';
import ConsultantsList from '@/features/admin/components/ConsultantsList';

const AdminConsultantsPage: React.FC = () => {
  return (
    <Layout>
      <ConsultantsList />
    </Layout>
  );
};

export default AdminConsultantsPage;