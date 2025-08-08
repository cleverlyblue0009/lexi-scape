import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Download, 
  Copy, 
  FileSignature, 
  Search, 
  BookOpen,
  Eye,
  VolumeX,
  Volume2
} from "lucide-react";

interface DocumentSection {
  level: string;
  text: string;
  page: number;
  content?: string;
}

interface DocumentData {
  title: string;
  outline: DocumentSection[];
  metadata?: {
    pages: number;
    language: string;
    estimatedReadingTime: number;
  };
}

interface DocumentViewerProps {
  document: DocumentData;
  onSectionClick: (section: DocumentSection) => void;
  isVoiceEnabled: boolean;
  onToggleVoice: () => void;
}

export const DocumentViewer = ({ 
  document, 
  onSectionClick, 
  isVoiceEnabled,
  onToggleVoice 
}: DocumentViewerProps) => {
  const [selectedSection, setSelectedSection] = useState<DocumentSection | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredSections = document.outline.filter(section =>
    section.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSectionClick = (section: DocumentSection) => {
    setSelectedSection(section);
    onSectionClick(section);
  };

  const handleCopyToClipboard = () => {
    if (selectedSection) {
      navigator.clipboard.writeText(selectedSection.text);
    }
  };

  const handleDownload = (format: 'txt' | 'md') => {
    const content = document.outline
      .map(section => {
        const prefix = format === 'md' 
          ? '#'.repeat(parseInt(section.level.replace('H', ''))) + ' '
          : '';
        return `${prefix}${section.text}`;
      })
      .join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.title.replace(/\s+/g, '_')}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Document Outline */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Document Outline</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onToggleVoice}
              className={isVoiceEnabled ? "text-primary" : ""}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
          
          {document.metadata && (
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">{document.metadata.pages} pages</Badge>
              <Badge variant="outline">{document.metadata.language}</Badge>
              <Badge variant="outline">{document.metadata.estimatedReadingTime} min read</Badge>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search sections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-md bg-background"
            />
          </div>
          
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {filteredSections.map((section, index) => (
                <div
                  key={index}
                  className={`
                    cursor-pointer p-3 rounded-lg border transition-all duration-200
                    ${selectedSection === section 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'hover:bg-muted border-transparent'
                    }
                  `}
                  onClick={() => handleSectionClick(section)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge 
                          variant={selectedSection === section ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {section.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Page {section.page}
                        </span>
                      </div>
                      <p className="text-sm font-medium line-clamp-2">
                        {section.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Document Content */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{document.title}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleDownload('txt')}>
                <Download className="w-4 h-4 mr-2" />
                TXT
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDownload('md')}>
                <Download className="w-4 h-4 mr-2" />
                MD
              </Button>
              {selectedSection && (
                <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {selectedSection ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge>{selectedSection.level}</Badge>
                <span className="text-sm text-muted-foreground">
                  Page {selectedSection.page}
                </span>
              </div>
              
              <Separator />
              
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold mb-4">{selectedSection.text}</h3>
                {selectedSection.content && (
                  <div className="text-sm leading-relaxed">
                    {selectedSection.content}
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <FileSignature className="w-4 h-4 mr-2" />
                  Summarize
                </Button>
                <Button variant="outline" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Simplify
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Related Sections
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a Section</h3>
              <p className="text-muted-foreground max-w-md">
                Choose a section from the outline to view its content, get insights, 
                and explore related information.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};