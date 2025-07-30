import React, { createContext, useContext, ReactNode } from 'react';
import { 
  Case, 
  CaseDetail, 
  SubmitCaseRequest, 
  ReviewSubmissionRequest, 
  PendingConsultant 
} from '@/types';
import { toast } from '@/hooks/use-toast';

interface ApiContextType {
  // Case related APIs
  submitCase: (caseData: SubmitCaseRequest) => Promise<boolean>;
  getCases: () => Promise<Case[]>;
  getCaseDetail: (caseId: string) => Promise<CaseDetail | null>;
  submitReview: (reviewData: ReviewSubmissionRequest) => Promise<boolean>;
  
  // File upload APIs
  uploadReference: (file: File) => Promise<boolean>;
  
  // Admin APIs
  getPendingConsultants: () => Promise<PendingConsultant[]>;
  approveConsultant: (consultantId: string) => Promise<boolean>;
  rejectConsultant: (consultantId: string) => Promise<boolean>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const getAuthHeaders = () => {
    const token = localStorage.getItem('jwt');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const submitCase = async (caseData: SubmitCaseRequest): Promise<boolean> => {
    try {
      // TODO: Call API to submit case
      const response = await fetch('http://localhost:5100/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(caseData),
      });
      
      // // Mock success for development
      // await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'تم إرسال الحالة بنجاح',
        description: 'سيتم مراجعة حالتك من قبل المختصين قريباً',
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'خطأ في إرسال الحالة',
        description: 'حدث خطأ أثناء إرسال الحالة، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
      return false;
    }
  };

  const getCases = async (): Promise<Case[]> => {
    try {
      // TODO: Call API to get cases
      const response = await fetch('http://localhost:5100/consultants/assigned-cases', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });


      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = (await response.json()) as Case[];
      return data;  
      // Mock data for development
      const mockCases: Case[] = [
        {
          id: 'ca00ae27-a4e9-4d30-86ba-5537da4470ae',
          title: 'مشاكل في الكتف الأيسر',
          description: 'أعاني من آلام في منطقة الكتف الأيسر مع تيبس وأصوات فرقعة، خاصة عند الجلوس بطرق معينة...',
          status: 'ReadyToReview',
          createdAt: '2025-07-12T20:42:17.559Z',
          email: 'patient@example.com',
          speciality: 'Medical'
        },
        {
          id: 'ca00ae27-a4e9-4d30-86ba-5537da4470ab',
          title: 'استشارة تقنية في البرمجة',
          description: 'أحتاج مساعدة في تطوير تطبيق ويب باستخدام React وNode.js...',
          status: 'Assigned',
          createdAt: '2025-07-05T10:30:00.000Z',
          email: 'developer@example.com',
          speciality: 'Technical'
        }
      ];
      
      return mockCases;
    } catch (error) {
      toast({
        title: 'خطأ في تحميل الحالات',
        description: 'حدث خطأ أثناء تحميل الحالات',
        variant: 'destructive',
      });
      return [];
    }
  };

  const getCaseDetail = async (caseId: string): Promise<CaseDetail | null> => {
    try {
      // TODO: Call API to get case detail
      const response = await fetch(`http://localhost:5100/cases/${caseId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      console.log(response);
      return (await response.json()) as CaseDetail;
      
    } catch (error) {
      toast({
        title: 'خطأ في تحميل تفاصيل الحالة',
        description: 'حدث خطأ أثناء تحميل تفاصيل الحالة',
        variant: 'destructive',
      });
      return null;
    }
  };

  const submitReview = async (reviewData: ReviewSubmissionRequest): Promise<boolean> => {
    try {
      // TODO: Call API to submit review
      const response = await fetch(`http://localhost:5100/cases/${reviewData.caseId}/add-solution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(reviewData.solution),
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'تم إرسال المراجعة بنجاح',
        description: 'شكراً لك على مراجعة الحالة',
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'خطأ في إرسال المراجعة',
        description: 'حدث خطأ أثناء إرسال المراجعة',
        variant: 'destructive',
      });
      return false;
    }
  };

  const uploadReference = async (file: File): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('http://localhost:5100/embedding/pdf', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000000));
      
      toast({
        title: 'تم رفع الملف بنجاح',
        description: `تم رفع الملف ${file.name} بنجاح`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'خطأ في رفع الملف',
        description: 'حدث خطأ أثناء رفع الملف',
        variant: 'destructive',
      });
      return false;
    }
  };

  const getPendingConsultants = async (): Promise<PendingConsultant[]> => {
    try {
      // TODO: Call API to get pending consultants
      // const response = await fetch('/api/admin/pending-consultants', {
      //   headers: {
      //     ...getAuthHeaders(),
      //   },
      // });
      // return await response.json();
      
      // Mock data for development
      const mockConsultants: PendingConsultant[] = [
        {
          id: '1',
          firstName: 'سارة',
          lastName: 'أحمد',
          doctorId: 'DOC123456',
          email: 'sara@example.com',
          speciality: 'Medical'
        },
        {
          id: '2',
          firstName: 'محمد',
          lastName: 'علي',
          doctorId: 'DOC789012',
          email: 'mohamed@example.com',
          speciality: 'Technical'
        }
      ];
      
      return mockConsultants;
    } catch (error) {
      toast({
        title: 'خطأ في تحميل المستشارين المعلقين',
        description: 'حدث خطأ أثناء تحميل قائمة المستشارين',
        variant: 'destructive',
      });
      return [];
    }
  };

  const approveConsultant = async (consultantId: string): Promise<boolean> => {
    try {
      // TODO: Call API to approve consultant
      // const response = await fetch(`/api/admin/consultants/${consultantId}/approve`, {
      //   method: 'POST',
      //   headers: {
      //     ...getAuthHeaders(),
      //   },
      // });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'تم قبول المستشار',
        description: 'تم قبول المستشار بنجاح',
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'خطأ في قبول المستشار',
        description: 'حدث خطأ أثناء قبول المستشار',
        variant: 'destructive',
      });
      return false;
    }
  };

  const rejectConsultant = async (consultantId: string): Promise<boolean> => {
    try {
      // TODO: Call API to reject consultant
      // const response = await fetch(`/api/admin/consultants/${consultantId}/reject`, {
      //   method: 'POST',
      //   headers: {
      //     ...getAuthHeaders(),
      //   },
      // });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'تم رفض المستشار',
        description: 'تم رفض المستشار',
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'خطأ في رفض المستشار',
        description: 'حدث خطأ أثناء رفض المستشار',
        variant: 'destructive',
      });
      return false;
    }
  };

  const value: ApiContextType = {
    submitCase,
    getCases,
    getCaseDetail,
    submitReview,
    uploadReference,
    getPendingConsultants,
    approveConsultant,
    rejectConsultant,
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};