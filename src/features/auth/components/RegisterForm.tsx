import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useAuth } from '@/contexts/AuthContext';
import { SPECIALITIES, RegisterRequest } from '@/types';
import { UserPlus, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const registerSchema = z.object({
  firstName: z.string().min(2, 'الاسم الأول يجب أن يكون حرفين على الأقل'),
  lastName: z.string().min(2, 'اسم العائلة يجب أن يكون حرفين على الأقل'),
  email: z.string().email('يرجى إدخال بريد إلكتروني صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string(),
  speciality: z.string().min(1, 'يرجى اختيار التخصص'),
  doctorId: z.string().min(1, 'يرجى إدخال رقم الهوية الطبية'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      speciality: '',
      doctorId: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsRegistering(true);
    
    const registerData: RegisterRequest = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      speciality: data.speciality,
      //doctorId: data.doctorId,
    };

    const success = await register(registerData);
    
    if (success) {
      navigate('/login');
    }
    
    setIsRegistering(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            إنشاء حساب جديد
          </CardTitle>
          <p className="text-muted-foreground text-center">
            املأ النموذج أدناه لإنشاء حساب مستشار جديد
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الأول</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أحمد"
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
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم العائلة</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="محمد"
                          {...field}
                          className="text-right"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                name="speciality"
                render={({ field }) => (
                  <FormItem dir="rtl">
                    <FormLabel>التخصص</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl dir="rtl">
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="اختر تخصصك" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent dir="rtl">
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
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهوية الطبية</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="DOC123456"
                        {...field}
                        className="text-right"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تأكيد كلمة المرور</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="text-right"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isRegistering}
                className="w-full"
                size="lg"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جارٍ التسجيل...
                  </>
                ) : (
                  <>
                    <UserPlus className="ml-2 h-4 w-4" />
                    إنشاء الحساب
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                لديك حساب بالفعل؟{' '}
                <Link to="/login" className="text-primary hover:underline">
                  سجل دخولك
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;