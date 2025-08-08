import { useState, useEffect } from "react";
import { Auth } from "@/pages/Auth";
import { Navigation } from "@/components/Navigation";
import { HomePage } from "@/components/HomePage";
import { AccessibilityPanel } from "@/components/AccessibilityPanel";
import { useToast } from "@/hooks/use-toast";
import { documentIntelligenceService, ProcessedDocument } from "@/services/documentIntelligence";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface AccessibilitySettings {
  dyslexicFont: boolean;
  fontSize: number;
  fontFamily: string;
  highContrast: boolean;
  darkMode: boolean;
  voiceReading: boolean;
  colorBlindFriendly: boolean;
  reducedMotion: boolean;
  language: string;
  readingSpeed: number;
}

// Remove DocumentData interface as we now use ProcessedDocument from service

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<ProcessedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    dyslexicFont: false,
    fontSize: 16,
    fontFamily: "inter",
    highContrast: false,
    darkMode: false,
    voiceReading: false,
    colorBlindFriendly: false,
    reducedMotion: false,
    language: "en",
    readingSpeed: 1.0
  });

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply font settings
    if (accessibilitySettings.dyslexicFont) {
      root.classList.add('font-dyslexic');
    } else {
      root.classList.remove('font-dyslexic');
    }
    
    // Apply theme settings
    if (accessibilitySettings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    if (accessibilitySettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Apply font size
    root.style.fontSize = `${accessibilitySettings.fontSize}px`;
    
    // Apply reduced motion
    if (accessibilitySettings.reducedMotion) {
      root.style.setProperty('--animation-fast', '0ms');
      root.style.setProperty('--animation-medium', '0ms');
      root.style.setProperty('--animation-slow', '0ms');
    } else {
      root.style.removeProperty('--animation-fast');
      root.style.removeProperty('--animation-medium');
      root.style.removeProperty('--animation-slow');
    }
  }, [accessibilitySettings]);

  const handleSignIn = (userData: User) => {
    setUser(userData);
    toast({
      title: "Welcome to DocuSense!",
      description: `Signed in as ${userData.name}`,
    });
  };

  const handleSignOut = () => {
    setUser(null);
    setUploadedDocuments([]);
    toast({
      title: "Signed out",
      description: "Come back soon!",
    });
  };

  const handleDocumentUpload = async (files: File[], persona?: string, jobToBeDone?: string) => {
    setIsLoading(true);
    toast({
      title: "Processing documents...",
      description: `Analyzing ${files.length} document(s) with AI intelligence`,
    });

    try {
      const processedDocuments = await documentIntelligenceService.processDocuments(
        files, 
        persona || "General User", 
        jobToBeDone || "Document Analysis"
      );
      
      setUploadedDocuments(processedDocuments);
      setIsLoading(false);
      
      toast({
        title: "Documents processed successfully!",
        description: `${processedDocuments.length} document(s) ready for intelligent analysis`,
      });
    } catch (error) {
      console.error('Error processing documents:', error);
      setIsLoading(false);
      toast({
        title: "Processing failed",
        description: "There was an error processing your documents. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAccessibilitySettingsChange = (newSettings: Partial<AccessibilitySettings>) => {
    setAccessibilitySettings(prev => ({ ...prev, ...newSettings }));
  };

  if (!user) {
    return <Auth onSignIn={handleSignIn} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        onAccessibilityOpen={() => setIsAccessibilityOpen(true)}
        onSignOut={handleSignOut}
        user={user}
      />
      
      <HomePage
        onDocumentUpload={handleDocumentUpload}
        uploadedDocuments={uploadedDocuments}
        isLoading={isLoading}
      />
      
      <AccessibilityPanel
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        settings={accessibilitySettings}
        onSettingsChange={handleAccessibilitySettingsChange}
      />
    </div>
  );
};

export default Index;
