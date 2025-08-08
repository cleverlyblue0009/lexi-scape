import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader, AlertCircle, ExternalLink } from "lucide-react";

interface AdobePDFViewerProps {
  fileUrl: string;
  fileName: string;
  insights?: Array<{
    page: number;
    text: string;
    importance: number;
    type?: string;
  }>;
  onInsightClick?: (insight: any) => void;
}

declare global {
  interface Window {
    AdobeDC: any;
  }
}

export const AdobePDFViewer = ({ 
  fileUrl, 
  fileName, 
  insights = [], 
  onInsightClick 
}: AdobePDFViewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adobeView, setAdobeView] = useState<any>(null);

  useEffect(() => {
    const loadAdobeSDK = async () => {
      try {
        // Check if Adobe DC is already loaded
        if (window.AdobeDC) {
          initializeViewer();
          return;
        }

        // Load Adobe PDF Embed API
        const script = document.createElement('script');
        script.src = 'https://documentservices.adobe.com/view-sdk/viewer.js';
        script.onload = () => {
          if (window.AdobeDC) {
            initializeViewer();
          } else {
            setError('Adobe PDF SDK failed to load');
            setIsLoading(false);
          }
        };
        script.onerror = () => {
          setError('Failed to load Adobe PDF SDK');
          setIsLoading(false);
        };
        document.head.appendChild(script);
      } catch (err) {
        console.error('Error loading Adobe SDK:', err);
        setError('Failed to initialize PDF viewer');
        setIsLoading(false);
      }
    };

    const initializeViewer = () => {
      if (!viewerRef.current || !window.AdobeDC) return;

      try {
        const adobeDCView = new window.AdobeDC.View({
          clientId: process.env.REACT_APP_ADOBE_CLIENT_ID || "demo", // Use demo for development
          divId: viewerRef.current.id
        });

        adobeDCView.previewFile({
          content: { location: { url: fileUrl } },
          metaData: { fileName: fileName }
        }, {
          embedMode: "SIZED_CONTAINER",
          showAnnotationTools: true,
          showLeftHandPanel: true,
          showDownloadPDF: true,
          showPrintPDF: true,
          showToolbar: true
        });

        setAdobeView(adobeDCView);
        setIsLoading(false);

        // Add insights as annotations
        if (insights.length > 0) {
          addInsightAnnotations(adobeDCView);
        }

      } catch (err) {
        console.error('Error initializing Adobe viewer:', err);
        setError('Failed to initialize PDF viewer');
        setIsLoading(false);
      }
    };

    const addInsightAnnotations = (viewer: any) => {
      // This would add clickable annotations based on insights
      // For now, we'll show them as overlay badges
      insights.forEach((insight, index) => {
        viewer.registerCallback(
          window.AdobeDC.View.Enum.CallbackType.GET_PAGE_API,
          (pageApi: any) => {
            // Add annotations programmatically
            // This is a simplified version - full implementation would require Adobe's annotation API
          }
        );
      });
    };

    loadAdobeSDK();

    return () => {
      // Cleanup if needed
      if (adobeView) {
        try {
          adobeView.destroy?.();
        } catch (err) {
          console.warn('Error destroying Adobe viewer:', err);
        }
      }
    };
  }, [fileUrl, fileName, insights]);

  if (error) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
        <h3 className="text-lg font-semibold mb-2">PDF Viewer Error</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.open(fileUrl, '_blank')}>
          <ExternalLink className="w-4 h-4 mr-2" />
          Open in New Tab
        </Button>
      </Card>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <Card className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading PDF viewer...</p>
          </div>
        </Card>
      )}
      
      {/* Insights overlay */}
      {insights.length > 0 && (
        <div className="absolute top-4 right-4 z-20 space-y-2">
          <h4 className="text-sm font-semibold text-foreground">AI Insights</h4>
          {insights.slice(0, 5).map((insight, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => onInsightClick?.(insight)}
            >
              Page {insight.page}: {insight.text.slice(0, 30)}...
            </Badge>
          ))}
        </div>
      )}
      
      <div
        ref={viewerRef}
        id={`adobe-dc-view-${Math.random().toString(36).substr(2, 9)}`}
        className="w-full h-[600px] border rounded-lg overflow-hidden"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
};