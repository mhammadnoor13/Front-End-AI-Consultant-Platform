import React, { useEffect, useState } from 'react';
import { useApi } from '@/contexts/ApiContext';
import { PendingConsultant } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, UserCheck, UserX, Users } from 'lucide-react';

const ConsultantsList: React.FC = () => {
  const [consultants, setConsultants] = useState<PendingConsultant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const { getPendingConsultants, approveConsultant, rejectConsultant } = useApi();

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    setIsLoading(true);
    // TODO: Call API to get pending consultants
    const consultantsData = await getPendingConsultants();
    setConsultants(consultantsData);
    setIsLoading(false);
  };

  const handleApprove = async (consultantId: string) => {
    setProcessingIds(prev => new Set(prev).add(consultantId));
    
    // TODO: Call API to approve consultant
    const success = await approveConsultant(consultantId);
    
    if (success) {
      setConsultants(prev => prev.filter(c => c.id !== consultantId));
    }
    
    setProcessingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(consultantId);
      return newSet;
    });
  };

  const handleReject = async (consultantId: string) => {
    setProcessingIds(prev => new Set(prev).add(consultantId));
    
    // TODO: Call API to reject consultant
    const success = await rejectConsultant(consultantId);
    
    if (success) {
      setConsultants(prev => prev.filter(c => c.id !== consultantId));
    }
    
    setProcessingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(consultantId);
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جارٍ تحميل المستشارين المعلقين...</p>
        </div>
      </div>
    );
  }

  if (consultants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-center">
        <Users className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">لا توجد طلبات معلقة</h3>
        <p className="text-muted-foreground mb-4">
          لا توجد طلبات تسجيل مستشارين تحتاج للمراجعة
        </p>
        <Button onClick={fetchConsultants} variant="outline">
          تحديث القائمة
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">مراجعة المستشارين</h1>
          <p className="text-muted-foreground">
            {consultants.length} {consultants.length === 1 ? 'طلب' : 'طلبات'} تحتاج للمراجعة
          </p>
        </div>
        <Button onClick={fetchConsultants} variant="outline">
          تحديث
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {consultants.map((consultant) => (
          <Card key={consultant.id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {consultant.firstName} {consultant.lastName}
              </CardTitle>
              <Badge variant="secondary" className="w-fit">
                {consultant.speciality}
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">البريد الإلكتروني:</span>
                  <p className="text-muted-foreground">{consultant.email}</p>
                </div>
                <div>
                  <span className="font-medium">رقم الهوية الطبية:</span>
                  <p className="text-muted-foreground font-mono">{consultant.doctorId}</p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleApprove(consultant.id)}
                  disabled={processingIds.has(consultant.id)}
                  className="flex-1"
                  size="sm"
                >
                  {processingIds.has(consultant.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4 ml-1" />
                      قبول
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => handleReject(consultant.id)}
                  disabled={processingIds.has(consultant.id)}
                  variant="destructive"
                  className="flex-1"
                  size="sm"
                >
                  {processingIds.has(consultant.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <UserX className="h-4 w-4 ml-1" />
                      رفض
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConsultantsList;