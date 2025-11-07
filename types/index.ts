// Core concept and gallery types
export interface Concept {
  id: string;
  name: string;
  tagline: string;
  qualities: string[];
  sectionId: string;
}

export interface GallerySection {
  id: string;
  title: string;
  description: string;
  concepts: Concept[];
}

// Attention tracking types
export interface ConceptExamination {
  hoverCount: number;
  totalDuration: number;
  revisits: number;
  lastHoverTime?: Date;
}

export interface AttentionSignals {
  sectionDwellTimes: Record<string, number>;
  conceptExaminations: Record<string, ConceptExamination>;
  browsingPath: string[];
  timestamp: Date;
}

// Insights types
export interface SectionInsight {
  sectionId: string;
  sectionTitle: string;
  dwellTime: number;
  interestLevel: 'high' | 'medium' | 'low';
  examinedConcepts: Concept[];
}

export interface AttentionInsights {
  highInterestSections: SectionInsight[];
  examinedConcepts: Concept[];
  totalBrowsingTime: number;
  readyForHybrids: boolean;
}

// API request/response types
export interface GenerateGalleryRequest {
  challenge: string;
}

export interface GenerateGalleryResponse {
  sessionId: string;
  sections: GallerySection[];
}

export interface GenerateHybridsRequest {
  sessionId: string;
  attentionData: AttentionSignals;
  originalGallery: GallerySection[];
  challenge: string;
}

export interface GenerateHybridsResponse {
  hybrids: Concept[];
  insights: AttentionInsights;
}

// Session data type
export interface SessionData {
  id: string;
  challenge: string;
  originalGallery: GallerySection[];
  attentionData?: AttentionSignals;
  hybridGallery?: Concept[];
  createdAt: Date;
}
