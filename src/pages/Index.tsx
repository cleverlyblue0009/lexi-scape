import { useState, useEffect } from "react";
import { Auth } from "@/pages/Auth";
import { Navigation } from "@/components/Navigation";
import { HomePage } from "@/components/HomePage";
import { AccessibilityPanel } from "@/components/AccessibilityPanel";
import { useToast } from "@/hooks/use-toast";

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

interface DocumentData {
  title: string;
  outline: Array<{
    level: string;
    text: string;
    page: number;
    content?: string;
  }>;
  metadata: {
    pages: number;
    language: string;
    estimatedReadingTime: number;
  };
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<DocumentData | null>(null);
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
    setUploadedDocument(null);
    toast({
      title: "Signed out",
      description: "Come back soon!",
    });
  };

  const handleDocumentUpload = async (file: File) => {
    setIsLoading(true);
    toast({
      title: "Processing document...",
      description: "Extracting intelligence from your PDF",
    });

    // Simulate PDF processing (integrate with your Python backend here)
    setTimeout(() => {
      const mockDocument: DocumentData = {
        title: file.name.replace('.pdf', ''),
        outline: [
          { level: "H1", text: "Introduction", page: 1, content: "This is the introduction section of the document..." },
          { level: "H2", text: "Background", page: 2, content: "Background information and context..." },
          { level: "H2", text: "Methodology", page: 4, content: "Research methodology and approach..." },
          { level: "H1", text: "Results", page: 6, content: "Results and findings from the analysis..." },
          { level: "H2", text: "Data Analysis", page: 7, content: "Detailed data analysis and interpretation..." },
          { level: "H1", text: "Conclusion", page: 10, content: "Summary and conclusions..." },
        ],
        metadata: {
          pages: 12,
          language: "English",
          estimatedReadingTime: 15
        }
      };
      
      setUploadedDocument(mockDocument);
      setIsLoading(false);
      
      toast({
        title: "Document processed successfully!",
        description: "Your PDF is now ready for intelligent analysis",
      });
    }, 3000);
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
        uploadedDocument={uploadedDocument}
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
