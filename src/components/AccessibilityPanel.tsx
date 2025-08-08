import { useState } from "react";
import { Settings, Type, Volume2, Eye, Palette, Sun, Moon, Languages, BookOpen, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

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

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onSettingsChange: (settings: Partial<AccessibilitySettings>) => void;
}

export const AccessibilityPanel = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange 
}: AccessibilityPanelProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const sections = [
    {
      id: 'typography',
      title: 'Typography',
      icon: Type,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="dyslexic-font" className="text-sm font-medium">
              Dyslexia-friendly font
            </label>
            <Switch 
              id="dyslexic-font"
              checked={settings.dyslexicFont}
              onCheckedChange={(checked) => onSettingsChange({ dyslexicFont: checked })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Font Size: {settings.fontSize}px</label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={([value]) => onSettingsChange({ fontSize: value })}
              min={12}
              max={24}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Font Family</label>
            <Select 
              value={settings.fontFamily} 
              onValueChange={(value) => onSettingsChange({ fontFamily: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter (Default)</SelectItem>
                <SelectItem value="georgia">Georgia</SelectItem>
                <SelectItem value="times">Times New Roman</SelectItem>
                <SelectItem value="arial">Arial</SelectItem>
                <SelectItem value="dyslexic">OpenDyslexic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    },
    {
      id: 'visual',
      title: 'Visual',
      icon: Eye,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="high-contrast" className="text-sm font-medium">
              High contrast mode
            </label>
            <Switch 
              id="high-contrast"
              checked={settings.highContrast}
              onCheckedChange={(checked) => onSettingsChange({ highContrast: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="dark-mode" className="text-sm font-medium">
              Dark mode
            </label>
            <Switch 
              id="dark-mode"
              checked={settings.darkMode}
              onCheckedChange={(checked) => onSettingsChange({ darkMode: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="color-blind" className="text-sm font-medium">
              Color-blind friendly
            </label>
            <Switch 
              id="color-blind"
              checked={settings.colorBlindFriendly}
              onCheckedChange={(checked) => onSettingsChange({ colorBlindFriendly: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="reduced-motion" className="text-sm font-medium">
              Reduced motion
            </label>
            <Switch 
              id="reduced-motion"
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => onSettingsChange({ reducedMotion: checked })}
            />
          </div>
        </div>
      )
    },
    {
      id: 'audio',
      title: 'Audio',
      icon: Volume2,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="voice-reading" className="text-sm font-medium">
              Voice reading
            </label>
            <Switch 
              id="voice-reading"
              checked={settings.voiceReading}
              onCheckedChange={(checked) => onSettingsChange({ voiceReading: checked })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Reading Speed</label>
            <Slider
              value={[settings.readingSpeed]}
              onValueChange={([value]) => onSettingsChange({ readingSpeed: value })}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slow</span>
              <span>Normal</span>
              <span>Fast</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'language',
      title: 'Language',
      icon: Languages,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Interface Language</label>
            <Select 
              value={settings.language} 
              onValueChange={(value) => onSettingsChange({ language: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-96 bg-card border-l shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Accessibility</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {sections.map((section) => (
              <Card key={section.id} className="overflow-hidden">
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setActiveSection(
                    activeSection === section.id ? null : section.id
                  )}
                >
                  <CardTitle className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <section.icon className="w-4 h-4" />
                      <span>{section.title}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {activeSection === section.id ? '−' : '+'}
                    </span>
                  </CardTitle>
                </CardHeader>
                
                {activeSection === section.id && (
                  <CardContent className="pt-0">
                    <Separator className="mb-4" />
                    {section.content}
                  </CardContent>
                )}
              </Card>
            ))}
            
            <Separator />
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Tutorial Mode
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};