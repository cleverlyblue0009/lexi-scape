import { useState } from "react";
import { Marquee } from "@/components/Marquee";
import { PDFUpload } from "@/components/PDFUpload";
import { FeatureCard } from "@/components/FeatureCard";
import { DocumentViewer } from "@/components/DocumentViewer";
import { 
  Accessibility, 
  Volume2, 
  Eye, 
  Type, 
  Palette, 
  BookOpen,
  Lightbulb,
  Play,
  Zap,
  Brain,
  Search,
  Clock
} from "lucide-react";

interface HomePageProps {
  onDocumentUpload: (file: File) => void;
  uploadedDocument?: any;
  isLoading?: boolean;
}

export const HomePage = ({ onDocumentUpload, uploadedDocument, isLoading }: HomePageProps) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const leftFeatures = [
    {
      id: "accessibility",
      icon: Accessibility,
      title: "Universal Accessibility",
      description: "Designed for everyone with screen readers, dyslexia support, and customizable interfaces"
    },
    {
      id: "voice",
      icon: Volume2,
      title: "Voice Reading",
      description: "Listen to documents with natural speech synthesis and adjustable reading speeds"
    },
    {
      id: "visual",
      icon: Eye,
      title: "Visual Enhancements",
      description: "High contrast modes, color-blind friendly themes, and customizable font sizes"
    },
    {
      id: "typography",
      icon: Type,
      title: "Smart Typography",
      description: "OpenDyslexic fonts, word spacing adjustments, and reading-optimized layouts"
    }
  ];

  const rightFeatures = [
    {
      id: "themes",
      icon: Palette,
      title: "Adaptive Themes",
      description: "Dark/light modes with intelligent contrast adjustment for optimal readability"
    },
    {
      id: "intelligence",
      icon: Brain,
      title: "AI Intelligence",
      description: "Smart content analysis, automatic summarization, and context-aware insights"
    },
    {
      id: "search",
      icon: Search,
      title: "Instant Search",
      description: "Find any content across documents with intelligent semantic search capabilities"
    },
    {
      id: "speed",
      icon: Clock,
      title: "Reading Time",
      description: "Estimated reading times, progress tracking, and personalized reading analytics"
    }
  ];

  const tipOfTheDay = {
    icon: Lightbulb,
    title: "Tip of the Day",
    description: "Use Ctrl+F to quickly search within any document section. Our smart search understands context and synonyms!"
  };

  const tutorialCard = {
    icon: Play,
    title: "Interactive Tutorial",
    description: "New to DocuSense? Take our 2-minute guided tour to discover all the powerful features."
  };

  const handleSectionClick = (section: any) => {
    console.log("Section clicked:", section);
  };

  if (uploadedDocument) {
    return (
      <div className="min-h-screen bg-background">
        <Marquee 
          text="🧠 AI-Powered Document Intelligence • Making Every PDF Accessible & Interactive • Offline-First Performance" 
          speed="normal"
        />
        <div className="container mx-auto px-4 py-8">
          <DocumentViewer
            document={uploadedDocument}
            onSectionClick={handleSectionClick}
            isVoiceEnabled={isVoiceEnabled}
            onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Marquee 
        text="🧠 Transforming Documents into Intelligent Experiences • AI-Powered Analysis • Universal Accessibility • Offline-First Performance" 
        speed="normal"
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Feature Cards */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-6 text-center lg:text-left">
              Accessibility Features
            </h2>
            {leftFeatures.map((feature) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                isActive={selectedFeature === feature.id}
                onClick={() => setSelectedFeature(
                  selectedFeature === feature.id ? null : feature.id
                )}
              />
            ))}
            
            {/* Tip of the Day */}
            <FeatureCard
              icon={tipOfTheDay.icon}
              title={tipOfTheDay.title}
              description={tipOfTheDay.description}
              className="border-warning/20 bg-warning/5"
            />
          </div>

          {/* Center Upload Area */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center space-x-2 mb-4">
                <Zap className="w-6 h-6 text-primary animate-pulse" />
                <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  DocuSense Intelligence
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-md mx-auto text-balance">
                Upload your PDF and watch it transform into an intelligent, 
                accessible document experience powered by AI.
              </p>
            </div>

            <PDFUpload onUpload={onDocumentUpload} isLoading={isLoading} />

            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>
                ✅ Adobe PDF Embed API Integration<br/>
                ✅ Offline-first performance<br/>
                ✅ Privacy-focused processing
              </p>
            </div>
          </div>

          {/* Right Feature Cards */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-6 text-center lg:text-left">
              Intelligence Features
            </h2>
            {rightFeatures.map((feature) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                isActive={selectedFeature === feature.id}
                onClick={() => setSelectedFeature(
                  selectedFeature === feature.id ? null : feature.id
                )}
              />
            ))}
            
            {/* Tutorial Card */}
            <FeatureCard
              icon={tutorialCard.icon}
              title={tutorialCard.title}
              description={tutorialCard.description}
              className="border-accent/20 bg-accent/5"
            />
          </div>
        </div>

        {/* Bottom Feature Showcase */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">
            Why Choose DocuSense?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-gradient-primary text-primary-foreground">
              <Brain className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-sm opacity-90">
                Advanced document analysis with contextual understanding and smart recommendations.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-secondary text-secondary-foreground">
              <Accessibility className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Universal Access</h3>
              <p className="text-sm opacity-90">
                Built from the ground up with accessibility in mind, ensuring everyone can access information.
              </p>
            </div>
            <div className="p-6 rounded-xl border-2 border-accent/20 bg-accent/5">
              <Zap className="w-8 h-8 mx-auto mb-4 text-accent" />
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Offline-first architecture ensures instant responses and seamless user experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};