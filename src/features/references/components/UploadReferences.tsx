import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApi } from '@/contexts/ApiContext';
import { Upload, File, Loader2, CheckCircle } from 'lucide-react';

const UploadReferences: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadReference } = useApi();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    // TODO: Call API to upload file
    const success = await uploadReference(selectedFile);
    
    if (success) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
    
    setIsUploading(false);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            إضافة مراجع
          </CardTitle>
          <p className="text-muted-foreground text-center">
            قم برفع الملفات المرجعية التي تساعد في تحسين الاستشارات
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          />

          {/* Upload Area */}
          <div 
            onClick={triggerFileSelect}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer 
                     hover:border-primary transition-colors duration-200"
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">اختر ملف للرفع</h3>
            <p className="text-muted-foreground text-sm">
              يمكنك رفع ملفات PDF, DOC, DOCX, TXT, JPG, PNG
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              الحد الأقصى لحجم الملف: 10 MB
            </p>
          </div>

          {/* Selected File Display */}
          {selectedFile && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <File className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full"
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جارٍ الرفع...
              </>
            ) : (
              <>
                <Upload className="ml-2 h-4 w-4" />
                رفع الملف
              </>
            )}
          </Button>

          {/* Instructions */}
          <div className="bg-accent/50 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">إرشادات الرفع:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• تأكد من أن الملف يحتوي على معلومات مفيدة ودقيقة</li>
              <li>• استخدم أسماء ملفات واضحة ومفهومة</li>
              <li>• يفضل رفع ملفات PDF للحصول على أفضل جودة</li>
              <li>• سيتم مراجعة جميع الملفات قبل إضافتها إلى قاعدة البيانات</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadReferences;