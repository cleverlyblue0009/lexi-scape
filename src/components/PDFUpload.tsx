import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PDFUploadProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

export const PDFUpload = ({ onUpload, isLoading = false }: PDFUploadProps) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf');
    if (pdfFile) {
      onUpload(pdfFile);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false)
  });

  return (
    <Card className="relative">
      <div 
        {...getRootProps()}
        className={`
          relative p-12 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-primary bg-primary/5 scale-105' 
            : 'border-muted hover:border-primary/50 hover:bg-primary/2'
          }
          ${isLoading ? 'pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-6">
          {isLoading ? (
            <div className="animate-pdf-to-person">
              <div className="relative">
                <FileText className="w-16 h-16 text-primary animate-pulse-glow" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-bounce" />
              </div>
            </div>
          ) : (
            <div className="relative">
              <Upload className={`w-16 h-16 transition-colors duration-300 ${
                isDragActive ? 'text-primary animate-bounce' : 'text-muted-foreground'
              }`} />
              {isDragActive && (
                <div className="absolute inset-0 w-16 h-16 border-2 border-primary rounded-full animate-ping" />
              )}
            </div>
          )}
          
          <div className="text-center space-y-2">
            {isLoading ? (
              <>
                <h3 className="text-lg font-semibold text-primary">
                  Giving life to your PDF...
                </h3>
                <p className="text-sm text-muted-foreground">
                  Analyzing document structure and extracting insights
                </p>
                <div className="flex items-center justify-center space-x-2 mt-4">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-xs text-muted-foreground">Processing</span>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">
                  {isDragActive ? 'Drop your PDF here' : 'Upload PDF Document'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Drag & drop or click to select a PDF file
                </p>
                <Button variant="outline" className="mt-4">
                  Select File
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};