import React, { useEffect, useState } from 'react';
import { useApi } from '@/contexts/ApiContext';
import { Case } from '@/types';
import CaseCard from './CaseCard';
import { Loader2, FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CasesList: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getCases } = useApi();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setIsLoading(true);
    // TODO: Call API to get cases
    const casesData = await getCases();
    setCases(casesData);
    setIsLoading(false);
  };

  const handleRefresh = () => {
    fetchCases();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جارٍ تحميل الحالات...</p>
        </div>
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-center">
        <FileX className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">لا توجد حالات متاحة</h3>
        <p className="text-muted-foreground mb-4">
          لا توجد حالات للمراجعة في الوقت الحالي
        </p>
        <Button onClick={handleRefresh} variant="outline">
          تحديث القائمة
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">الحالات المطلوب مراجعتها</h1>
          <p className="text-muted-foreground">
            {cases.length} {cases.length === 1 ? 'حالة' : 'حالات'} متاحة للمراجعة
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          تحديث
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cases.map((caseData) => (
          <CaseCard key={caseData.id} caseData={caseData} />
        ))}
      </div>
    </div>
  );
};

export default CasesList;