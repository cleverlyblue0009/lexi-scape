// Document Intelligence Service - Implements Round 1B functionality
// This service processes PDFs and extracts persona-driven insights

export interface DocumentMetadata {
  pages: number;
  language: string;
  estimatedReadingTime: number;
  fileSize: number;
  createdAt: string;
}

export interface DocumentSection {
  level: string;
  text: string;
  page: number;
  content?: string;
  importance_rank?: number;
}

export interface SubsectionAnalysis {
  document: string;
  refined_text: string;
  page_number: number;
  relevance_score?: number;
}

export interface DocumentIntelligenceResult {
  metadata: {
    input_documents: string[];
    persona: string;
    job_to_be_done: string;
    processing_timestamp: string;
  };
  extracted_sections: Array<{
    document: string;
    section_title: string;
    importance_rank: number;
    page_number: number;
  }>;
  subsection_analysis: SubsectionAnalysis[];
  document_outline: DocumentSection[];
  insights: Array<{
    page: number;
    text: string;
    importance: number;
    type: 'key_finding' | 'relevant_section' | 'action_item';
  }>;
}

export interface ProcessedDocument {
  title: string;
  outline: DocumentSection[];
  metadata: DocumentMetadata;
  intelligence: DocumentIntelligenceResult;
  fileUrl?: string;
}

class DocumentIntelligenceService {
  
  /**
   * Process multiple PDF files with persona-driven analysis
   */
  async processDocuments(
    files: File[], 
    persona: string = '', 
    jobToBeDone: string = ''
  ): Promise<ProcessedDocument[]> {
    const results: ProcessedDocument[] = [];
    
    for (const file of files) {
      try {
        const processedDoc = await this.processSingleDocument(file, persona, jobToBeDone);
        results.push(processedDoc);
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        // Continue with other files even if one fails
      }
    }
    
    return results;
  }

  /**
   * Process a single PDF file
   */
  private async processSingleDocument(
    file: File, 
    persona: string, 
    jobToBeDone: string
  ): Promise<ProcessedDocument> {
    
    // Create file URL for Adobe viewer
    const fileUrl = URL.createObjectURL(file);
    
    // Extract basic metadata
    const metadata: DocumentMetadata = {
      pages: await this.estimatePageCount(file),
      language: 'English', // Would use language detection in real implementation
      estimatedReadingTime: await this.estimateReadingTime(file),
      fileSize: file.size,
      createdAt: new Date().toISOString()
    };

    // Extract document structure (simulated - would use PDF parsing)
    const outline = await this.extractDocumentOutline(file);
    
    // Generate title from filename
    const title = file.name.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ');

    // Perform persona-driven intelligence analysis
    const intelligence = await this.performIntelligenceAnalysis(
      file, 
      outline, 
      persona, 
      jobToBeDone
    );

    return {
      title,
      outline,
      metadata,
      intelligence,
      fileUrl
    };
  }

  /**
   * Extract document outline and structure
   */
  private async extractDocumentOutline(file: File): Promise<DocumentSection[]> {
    // Simulated outline extraction - in real implementation would use PDF parsing
    // This would integrate with the Python code provided
    
    const mockOutline: DocumentSection[] = [
      { level: "H1", text: "Executive Summary", page: 1, content: "High-level overview of the document contents..." },
      { level: "H2", text: "Introduction", page: 2, content: "Introduction and background information..." },
      { level: "H2", text: "Methodology", page: 4, content: "Research methodology and approach..." },
      { level: "H1", text: "Key Findings", page: 6, content: "Main results and discoveries..." },
      { level: "H2", text: "Data Analysis", page: 7, content: "Detailed data analysis and interpretation..." },
      { level: "H2", text: "Market Trends", page: 9, content: "Current market trends and patterns..." },
      { level: "H1", text: "Recommendations", page: 11, content: "Strategic recommendations based on findings..." },
      { level: "H2", text: "Implementation Plan", page: 12, content: "Step-by-step implementation strategy..." },
      { level: "H1", text: "Conclusion", page: 14, content: "Summary and final thoughts..." }
    ];

    return mockOutline;
  }

  /**
   * Perform persona-driven intelligence analysis (Round 1B implementation)
   */
  private async performIntelligenceAnalysis(
    file: File,
    outline: DocumentSection[],
    persona: string,
    jobToBeDone: string
  ): Promise<DocumentIntelligenceResult> {
    
    // Simulate the Round 1B scoring algorithm
    const rankedSections = this.rankSectionsByRelevance(outline, persona, jobToBeDone);
    
    // Extract top sections for detailed analysis
    const topSections = rankedSections.slice(0, 10);
    
    // Generate subsection analysis
    const subsectionAnalysis = await this.generateSubsectionAnalysis(topSections, persona, jobToBeDone);
    
    // Generate insights
    const insights = this.generateInsights(topSections, persona, jobToBeDone);

    return {
      metadata: {
        input_documents: [file.name],
        persona: persona || 'General User',
        job_to_be_done: jobToBeDone || 'Document Analysis',
        processing_timestamp: new Date().toISOString()
      },
      extracted_sections: topSections.map(section => ({
        document: file.name,
        section_title: section.text,
        importance_rank: section.importance_rank || 1,
        page_number: section.page
      })),
      subsection_analysis: subsectionAnalysis,
      document_outline: outline,
      insights
    };
  }

  /**
   * Rank sections by relevance to persona and job
   */
  private rankSectionsByRelevance(
    sections: DocumentSection[], 
    persona: string, 
    jobToBeDone: string
  ): DocumentSection[] {
    
    // Simulate TF-IDF scoring based on persona and job keywords
    const keywords = this.extractKeywords(persona, jobToBeDone);
    
    const scoredSections = sections.map((section, index) => {
      const score = this.calculateRelevanceScore(section, keywords);
      return {
        ...section,
        importance_rank: index + 1,
        relevance_score: score
      };
    });

    // Sort by relevance score
    return scoredSections.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));
  }

  /**
   * Extract keywords from persona and job description
   */
  private extractKeywords(persona: string, jobToBeDone: string): string[] {
    const text = `${persona} ${jobToBeDone}`.toLowerCase();
    const keywords = text.split(/\s+/).filter(word => word.length > 3);
    return [...new Set(keywords)]; // Remove duplicates
  }

  /**
   * Calculate relevance score for a section
   */
  private calculateRelevanceScore(section: DocumentSection, keywords: string[]): number {
    const sectionText = `${section.text} ${section.content || ''}`.toLowerCase();
    let score = 0;
    
    keywords.forEach(keyword => {
      const occurrences = (sectionText.match(new RegExp(keyword, 'g')) || []).length;
      score += occurrences;
    });
    
    // Boost score for certain section types
    if (section.level === 'H1') score *= 1.5;
    if (section.text.toLowerCase().includes('summary')) score *= 1.3;
    if (section.text.toLowerCase().includes('conclusion')) score *= 1.2;
    
    return score;
  }

  /**
   * Generate subsection analysis
   */
  private async generateSubsectionAnalysis(
    sections: DocumentSection[],
    persona: string,
    jobToBeDone: string
  ): Promise<SubsectionAnalysis[]> {
    
    const analysis: SubsectionAnalysis[] = [];
    
    sections.slice(0, 5).forEach(section => {
      if (section.content) {
        // Split content into sentences and select most relevant
        const sentences = section.content.split(/[.!?]+/).filter(s => s.trim().length > 10);
        const topSentences = sentences.slice(0, 3); // Take first 3 sentences as example
        
        topSentences.forEach(sentence => {
          analysis.push({
            document: section.text,
            refined_text: sentence.trim(),
            page_number: section.page,
            relevance_score: Math.random() * 0.5 + 0.5 // Simulated score
          });
        });
      }
    });

    return analysis;
  }

  /**
   * Generate AI insights
   */
  private generateInsights(
    sections: DocumentSection[],
    persona: string,
    jobToBeDone: string
  ): Array<{
    page: number;
    text: string;
    importance: number;
    type: 'key_finding' | 'relevant_section' | 'action_item';
  }> {
    
    const insights = [];
    
    // Generate different types of insights based on sections
    sections.slice(0, 5).forEach((section, index) => {
      insights.push({
        page: section.page,
        text: `Key insight from ${section.text}: ${section.content?.slice(0, 100) || 'Important information relevant to your role.'}`,
        importance: 5 - index, // Higher importance for earlier sections
        type: index < 2 ? 'key_finding' : (index < 4 ? 'relevant_section' : 'action_item') as any
      });
    });

    return insights;
  }

  /**
   * Estimate page count from file size
   */
  private async estimatePageCount(file: File): Promise<number> {
    // Rough estimation: 50KB per page average
    return Math.max(1, Math.round(file.size / 51200));
  }

  /**
   * Estimate reading time
   */
  private async estimateReadingTime(file: File): Promise<number> {
    // Rough estimation: 250 words per page, 200 words per minute
    const estimatedPages = await this.estimatePageCount(file);
    const estimatedWords = estimatedPages * 250;
    return Math.max(1, Math.round(estimatedWords / 200));
  }
}

export const documentIntelligenceService = new DocumentIntelligenceService();