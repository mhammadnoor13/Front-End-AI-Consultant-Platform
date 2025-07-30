import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Case } from '@/types';
import { Eye, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CaseCardProps {
  caseData: Case;
}

const CaseCard: React.FC<CaseCardProps> = ({ caseData }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Assigned':
        return 'bg-warning';
      case 'ReadyToReview':
        return 'bg-success';
      default:
        return 'bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Assigned':
        return 'في انتظار اقتراحات الذكي الاصطناعي';
      case 'ReadyToReview':
        return 'في انتظار المراجعة';
      default:
        return status;
    }
  };

  const getDaysWaiting = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getWaitingTimeColor = (days: number) => {
    if (days > 10) return 'text-destructive';
    if (days > 5) return 'text-warning';
    return 'text-muted-foreground';
  };

  const daysWaiting = getDaysWaiting(caseData.createdAt);

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-card-foreground line-clamp-2">
            {caseData.title}  
          </h3>
          <div className="flex items-center gap-2 ml-2">
            {/* Status Indicator */}
            <div className="group relative">
              <div 
                className={`w-3 h-3 rounded-full ${getStatusColor(caseData.status)} 
                           transition-transform duration-200 group-hover:scale-y-150`}
              />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                            px-2 py-1 bg-popover text-popover-foreground text-xs rounded 
                            whitespace-nowrap opacity-0 group-hover:opacity-100 
                            transition-opacity duration-200 pointer-events-none z-10
                            shadow-lg border border-border">
                {getStatusText(caseData.status)}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
<CardContent className="flex flex-col h-full gap-y-1">
    {/* 1. Description */}
    <p className="basis-1/2 flex-none overflow-hidden text-muted-foreground text-sm line-clamp-3">
      {caseData.description}
    </p>

    {/* 2. Meta row (date + speciality) */}
    <div className="basis-[15%] flex-none flex items-center justify-between text-xs">
      <div className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        <span className={getWaitingTimeColor(daysWaiting)}>
          منذ {daysWaiting} {daysWaiting === 1 ? 'يوم' : 'أيام'}
        </span>
      </div>
      <Badge variant="secondary" className="text-xs">
        {caseData.speciality}
      </Badge>
    </div>

    {/* 3. Button */}
    <div className="basis-[35%] flex-none flex items-end mt-2 pb-2">
      <Button asChild className="w-full" size="sm">
        <Link to={`/cases/${caseData.id}`} className="flex items-center justify-center gap-2">
          <Eye className="h-4 w-4" />
          مراجعة الحالة
        </Link>
      </Button>
    </div>
  </CardContent>
    </Card>
  );
};

export default CaseCard;