/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ComplexityLevel = "layman" | "undergraduate" | "expert";

export interface Summary {
  title: string;
  problemStatement: string;
  keyFindings: string;
}

export interface ChartData {
  label: string;
  value: number;
  unit: string;
}

export interface Section {
  title: string;
  content: {
    layman: string;
    undergraduate: string;
    expert: string;
  };
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface CitationNode {
  id: string;
  label: string;
  group: number;
}

export interface CitationLink {
  source: string;
  target: string;
}

export interface CitationGraphData {
  nodes: CitationNode[];
  links: CitationLink[];
}

export interface ResearchPaperAnalysis {
  summary: Summary;
  flowchart: string; // Mermaid.js code
  visuals: ChartData[];
  sections: Section[];
  glossary: GlossaryItem[];
  citations: CitationGraphData;
}
