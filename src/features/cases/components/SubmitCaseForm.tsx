import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApi } from '@/contexts/ApiContext';
import { SPECIALITIES, SubmitCaseRequest } from '@/types';
import { Send, Loader2 } from 'lucide-react';

const submitCaseSchema = z.object({
  email: z.string().email('يرجى إدخال بريد إلكتروني صحيح'),
  title: z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل'),
  description: z.string().min(20, 'الوصف يجب أن يكون 20 حرف على الأقل'),
  speciality: z.string().min(1, 'يرجى اختيار التخصص'),
});

type SubmitCaseFormData = z.infer<typeof submitCaseSchema>;

const SubmitCaseForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitCase } = useApi();

  const form = useForm<SubmitCaseFormData>({
    resolver: zodResolver(submitCaseSchema),
    defaultValues: {
      email: '',
      title: '',
      description: '',
      speciality: '',
    },
  });

  const onSubmit = async (data: SubmitCaseFormData) => {
    setIsSubmitting(true);
    
    const caseData: SubmitCaseRequest = {
      email: data.email,
      title: data.title,
      description: data.description,
      speciality: data.speciality,
    };

    const success = await submitCase(caseData);
    
    if (success) {
      form.reset();
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            إرسال حالة جديدة
          </CardTitle>
          <p className="text-muted-foreground text-center">
            املأ النموذج أدناه لإرسال حالتك وستحصل على استشارة من المختصين
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        {...field}
                        className="text-right"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان الحالة</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="أدخل عنوان مختصر للحالة"
                        {...field}
                        className="text-right"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="speciality"
                render={({ field }) => (
                  <FormItem dir="rtl">
                    <FormLabel>التخصص</FormLabel>
                    <Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="اختر التخصص المناسب" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SPECIALITIES.map((speciality) => (
                          <SelectItem key={speciality} value={speciality}>
                            {speciality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وصف الحالة</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="اكتب وصفاً مفصلاً لحالتك..."
                        className="min-h-32 text-right"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جارٍ الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="ml-2 h-4 w-4" />
                    إرسال الحالة
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmitCaseForm;