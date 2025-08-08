import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PDFUploadProps {
  onUpload: (files: File[], persona?: string, jobToBeDone?: string) => void;
  isLoading?: boolean;
}

export const PDFUpload = ({ onUpload, isLoading = false }: PDFUploadProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [persona, setPersona] = useState("");
  const [jobToBeDone, setJobToBeDone] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length > 0) {
      onUpload(pdfFiles, persona, jobToBeDone);
    }
  }, [onUpload, persona, jobToBeDone]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true,
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
                  Drag & drop or click to select PDF files (multiple supported)
                </p>
                
                {/* Persona and Job inputs */}
                <div className="w-full max-w-md space-y-3 mt-4">
                  <input
                    type="text"
                    placeholder="Your role (e.g., Travel Planner, Research Analyst)"
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                  />
                  <input
                    type="text"
                    placeholder="Job to be done (e.g., Plan a 4-day trip to Paris)"
                    value={jobToBeDone}
                    onChange={(e) => setJobToBeDone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                  />
                </div>
                
                <Button variant="outline" className="mt-4">
                  Select Files
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};