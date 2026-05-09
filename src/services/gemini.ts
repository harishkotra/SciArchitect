import { GoogleGenAI, Type } from "@google/genai";
import { ResearchPaperAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzePaper(pdfBase64: string): Promise<ResearchPaperAnalysis> {
  const model = "gemini-3-flash-preview"; // Using the latest recommended flash model for speed and reliability

  const prompt = `
    Perform a rapid, high-precision analysis of this research paper. 
    1. Flowchart: Generate Mermaid.js code for the methodology.
    2. Metrics: Extract 3-5 key quantitative findings (label, value, unit).
    3. Content: Create 3 versions (Layman, Undergraduate, Expert) for Intro, Methods, and Results.
    4. Glossary: 5 complex terms defined.
    5. Citations: Extract 5-10 key papers cited in this paper out of all the citations, and represent them in a citation graph data structure. The current paper should be Node 1. The cited papers should be other nodes.
    Return strictly JSON.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: pdfBase64,
              mimeType: "application/pdf"
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              problemStatement: { type: Type.STRING },
              keyFindings: { type: Type.STRING }
            },
            required: ["title", "problemStatement", "keyFindings"]
          },
          flowchart: { 
            type: Type.STRING,
            description: "The Mermaid.js code for the methodology flowchart."
          },
          visuals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.NUMBER },
                unit: { type: Type.STRING }
              }
            }
          },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: {
                  type: Type.OBJECT,
                  properties: {
                    layman: { type: Type.STRING },
                    undergraduate: { type: Type.STRING },
                    expert: { type: Type.STRING }
                  },
                  required: ["layman", "undergraduate", "expert"]
                }
              },
              required: ["title", "content"]
            }
          },
          glossary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                definition: { type: Type.STRING }
              }
            }
          },
          citations: {
            type: Type.OBJECT,
            properties: {
              nodes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING },
                    group: { type: Type.NUMBER }
                  },
                  required: ["id", "label", "group"]
                }
              },
              links: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    source: { type: Type.STRING },
                    target: { type: Type.STRING }
                  },
                  required: ["source", "target"]
                }
              }
            },
            required: ["nodes", "links"]
          }
        },
        required: ["summary", "flowchart", "visuals", "sections", "glossary", "citations"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  
  try {
    return JSON.parse(text) as ResearchPaperAnalysis;
  } catch (err) {
    console.error("Failed to parse JSON from Gemini:", text);
    throw new Error("Invalid response format from AI");
  }
}
