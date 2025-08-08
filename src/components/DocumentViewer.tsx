import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdobePDFViewer } from "./AdobePDFViewer";
import { ProcessedDocument } from "@/services/documentIntelligence";
import { 
  FileText, 
  Download, 
  Copy, 
  FileSignature, 
  Search, 
  BookOpen,
  Eye,
  VolumeX,
  Volume2,
  Brain,
  Lightbulb,
  Target
} from "lucide-react";

interface DocumentViewerProps {
  documents: ProcessedDocument[];
  onSectionClick: (section: any) => void;
  isVoiceEnabled: boolean;
  onToggleVoice: () => void;
}

export const DocumentViewer = ({ 
  documents, 
  onSectionClick, 
  isVoiceEnabled,
  onToggleVoice 
}: DocumentViewerProps) => {
  const [selectedDocument, setSelectedDocument] = useState(0);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  
  const currentDoc = documents[selectedDocument];
  if (!currentDoc) return null;
  
  const filteredSections = currentDoc.outline.filter(section =>
    section.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSectionClick = (section: any) => {
    setSelectedSection(section);
    onSectionClick(section);
  };

  const handleInsightClick = (insight: any) => {
    console.log('Insight clicked:', insight);
    // Navigate to specific page or highlight relevant section
  };

  const handleCopyToClipboard = () => {
    if (selectedSection) {
      navigator.clipboard.writeText(selectedSection.text);
    }
  };

  const handleDownload = (format: 'txt' | 'md') => {
    const content = currentDoc.outline
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
    a.download = `${currentDoc.title.replace(/\s+/g, '_')}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Document Selector */}
      {documents.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {documents.map((doc, index) => (
            <Button
              key={index}
              variant={selectedDocument === index ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDocument(index)}
              className="whitespace-nowrap"
            >
              {doc.title}
            </Button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="viewer">PDF Viewer</TabsTrigger>
          <TabsTrigger value="intelligence">AI Insights</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{currentDoc.metadata.pages} pages</Badge>
                  <Badge variant="outline">{currentDoc.metadata.language}</Badge>
                  <Badge variant="outline">{currentDoc.metadata.estimatedReadingTime} min read</Badge>
                </div>
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
            <CardTitle className="text-lg">{currentDoc.title}</CardTitle>
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
        </TabsContent>

        <TabsContent value="viewer" className="space-y-4">
          {currentDoc.fileUrl && (
            <AdobePDFViewer
              fileUrl={currentDoc.fileUrl}
              fileName={currentDoc.title}
              insights={currentDoc.intelligence.insights}
              onInsightClick={handleInsightClick}
            />
          )}
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Persona Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Persona Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Persona:</p>
                  <Badge variant="outline">{currentDoc.intelligence.metadata.persona}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Job to be done:</p>
                  <p className="text-sm text-muted-foreground">
                    {currentDoc.intelligence.metadata.job_to_be_done}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Top Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>AI Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {currentDoc.intelligence.insights.map((insight, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleInsightClick(insight)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge 
                            variant={insight.type === 'key_finding' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {insight.type.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Page {insight.page}
                          </span>
                        </div>
                        <p className="text-sm">{insight.text}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Extracted Sections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>Relevant Sections</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-2">
                    {currentDoc.intelligence.extracted_sections.map((section, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSectionClick(section)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="text-xs">
                            Rank #{section.importance_rank}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Page {section.page_number}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{section.section_title}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Subsection Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Key Excerpts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {currentDoc.intelligence.subsection_analysis.slice(0, 10).map((analysis, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">
                            Page {analysis.page_number}
                          </span>
                          {analysis.relevance_score && (
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(analysis.relevance_score * 100)}% relevant
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm">{analysis.refined_text}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};