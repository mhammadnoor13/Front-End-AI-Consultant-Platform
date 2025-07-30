import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApi } from '@/contexts/ApiContext';
import { CaseDetail, ReviewSubmissionRequest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowRight, Send, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const reviewSchema = z.object({
  reviewType: z.string().min(1, 'يرجى اختيار نوع المراجعة'),
  customSuggestion: z.string().optional(),
}).refine((data) => {
  if (data.reviewType === 'custom' && (!data.customSuggestion || data.customSuggestion.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: 'يرجى كتابة الاقتراح المخصص',
  path: ['customSuggestion'],
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const CaseDetailView: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { getCaseDetail, submitReview } = useApi();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      reviewType: '',
      customSuggestion: '',
    },
  });

  const watchReviewType = form.watch('reviewType');

  useEffect(() => {
    if (caseId) {
      fetchCaseDetail();
    }
  }, [caseId]);

  const fetchCaseDetail = async () => {
    if (!caseId) return;
    
    setIsLoading(true);
    // TODO: Call API to get case detail
    const detail = await getCaseDetail(caseId);
    setCaseDetail(detail);
    setIsLoading(false);
  };

  const handleSubmitReview = () => {
    setShowConfirmDialog(true);
  };

  const confirmSubmitReview = async () => {
    if (!caseDetail || !caseId) return;

    setIsSubmitting(true);
    setShowConfirmDialog(false);

    const { reviewType, customSuggestion } = form.getValues();

    const solution =
      reviewType === 'custom'
        ? customSuggestion!
        : caseDetail.suggestions.find(s => s.id === reviewType)?.text ?? '';

    const reviewData: ReviewSubmissionRequest = {
      caseId,
      solution
    };

    // TODO: Call API to submit review
    const success = await submitReview(reviewData);
    
    if (success) {
      navigate('/cases');
    }
    
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جارٍ تحميل تفاصيل الحالة...</p>
        </div>
      </div>
    );
  }

  if (!caseDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-center">
        <h3 className="text-lg font-semibold mb-2">الحالة غير موجودة</h3>
        <p className="text-muted-foreground mb-4">
          لم يتم العثور على الحالة المطلوبة
        </p>
        <Button onClick={() => navigate('/cases')} variant="outline">
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة للحالات
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Button 
          onClick={() => navigate('/cases')} 
          variant="ghost" 
          className="mb-4"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة للحالات
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">
              {caseDetail.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(caseDetail.createdAt), 'PPP', { locale: ar })}
                </span>
              </div>
            </div>
          </div>
          
          <Badge variant="secondary" className="text-sm">
            {caseDetail.status}
          </Badge>
        </div>
      </div>

      {/* Case Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>وصف الحالة</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">
            {caseDetail.description}
          </p>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>اقتراحات الذكاء الاصطناعي</CardTitle>
          <p className="text-sm text-muted-foreground">
            اختر أحد الاقتراحات التالية أو اكتب اقتراحك المخصص
          </p>
        </CardHeader>
        <CardContent >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitReview)} className="space-y-4">
              <FormField
                control={form.control}
                name="reviewType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup dir="rtl"
                        value={field.value}
                        onValueChange={field.onChange}
                        className="space-y-3"
                      >
                        {caseDetail.suggestions.map((suggestion) => (
                          <div key={suggestion.id} className="flex items-start space-x-reverse space-x-2 ">
                            <RadioGroupItem value={suggestion.id} id={suggestion.id} />
                            <Label 
                              htmlFor={suggestion.id} 
                              className="text-sm leading-relaxed cursor-pointer flex-1"
                            >
                              {suggestion.text}
                            </Label>
                          </div>
                        ))}
                        
                        {/* Custom suggestion option */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-reverse space-x-2">
                            <RadioGroupItem value="custom" id="custom" />
                            <Label htmlFor="custom" className="text-sm cursor-pointer">
                              كتابة اقتراح مخصص
                            </Label>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="customSuggestion"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                    placeholder="اكتب اقتراحك هنا..."
                                    disabled={watchReviewType !== 'custom'}
                                    className={`text-right ${watchReviewType !== 'custom' ? 'opacity-50' : ''}`}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="px-8"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جارٍ الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="ml-2 h-4 w-4" />
                      إرسال المراجعة
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد إرسال المراجعة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من أنك تريد إرسال هذه المراجعة؟ لن تتمكن من تعديلها بعد الإرسال.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmitReview}>
              تأكيد الإرسال
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CaseDetailView;