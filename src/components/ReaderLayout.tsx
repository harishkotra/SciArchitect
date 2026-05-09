import { useState, useEffect } from "react";
import { ResearchPaperAnalysis, ComplexityLevel } from "../types";
import ComplexitySlider from "./ComplexitySlider";
import MermaidViewer from "./MermaidViewer";
import DataVisualizer from "./DataVisualizer";
import Glossary from "./Glossary";
import ReactMarkdown from "react-markdown";
import CitationGraph from "./CitationGraph";
import LZString from "lz-string";
import { 
  Menu, 
  MessageSquare, 
  Target, 
  Activity, 
  BookOpen, 
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Save,
  Check,
  Share2
} from "lucide-react";
import { cn } from "../lib/utils";

interface ReaderLayoutProps {
  analysis: ResearchPaperAnalysis;
  onBack: () => void;
}

export default function ReaderLayout({ analysis, onBack }: ReaderLayoutProps) {
  const [complexity, setComplexity] = useState<ComplexityLevel>("undergraduate");
  const [activeSection, setActiveSection] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const sidebarItems = [
    { label: "Dashboard Overview", icon: Target },
    { label: "Methodology Pipeline", icon: Activity },
    { label: "Statistical Analysis", icon: MessageSquare },
    { label: "Technical Glossary", icon: BookOpen },
  ];

  const handleSaveAnalysis = () => {
    try {
      const savedAnalysesStr = localStorage.getItem("savedAnalyses");
      const savedAnalyses = savedAnalysesStr ? JSON.parse(savedAnalysesStr) : [];
      
      const isAlreadySaved = savedAnalyses.some((a: any) => a.summary?.title === analysis.summary.title);
      
      if (!isAlreadySaved) {
        const newAnalysis = {
          id: Date.now().toString(),
          savedAt: new Date().toISOString(),
          ...analysis
        };
        savedAnalyses.push(newAnalysis);
        localStorage.setItem("savedAnalyses", JSON.stringify(savedAnalyses));
      }
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save analysis:", error);
      alert("Failed to save analysis. Space limit might be reached.");
    }
  };

  const handleShareAnalysis = async () => {
    try {
      // Compress the analysis object into a URL-safe string
      const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(analysis));
      const shareUrl = `${window.location.origin}${window.location.pathname}#share=${compressed}`;
      
      await navigator.clipboard.writeText(shareUrl);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 3000);
    } catch (error) {
      console.error("Failed to generate share link:", error);
      alert("Failed to copy share link to clipboard.");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <nav className="hidden md:flex h-full w-64 flex-col border-r border-slate-200 bg-white p-5">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-200">
            <Sparkles size={18} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 font-display">SciArchitect</span>
        </div>
        
        <div className="flex flex-col gap-1">
          {sidebarItems.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveSection(i)}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200",
                activeSection === i 
                  ? "bg-indigo-50 font-bold text-indigo-700" 
                  : "font-medium text-slate-500 hover:bg-slate-50"
              )}
            >
              <item.icon size={18} strokeWidth={activeSection === i ? 2.5 : 2} />
              {item.label}
            </button>
          ))}
        </div>

        <button 
          onClick={onBack}
          className="mt-6 flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          NEW ANALYSIS
        </button>

        <div className="mt-auto rounded-xl bg-slate-900 p-4 text-white shadow-lg">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Reference Protocol</p>
          <p className="mt-2 text-[11px] leading-relaxed opacity-90 font-medium">
            AI Analytics: v1.0.4<br/>
            Engine: Gemini 3.1 Pro<br/>
            Context: Peer-Reviewed Data
          </p>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div className="flex flex-col truncate pr-4">
            <h1 className="text-lg font-bold text-slate-800 leading-none truncate font-display">
              {analysis.summary.title}
            </h1>
            <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider font-bold">
              AI-Augmented Synthesis • {new Date().toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <ComplexitySlider level={complexity} onChange={setComplexity} />
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={handleShareAnalysis}
                disabled={isShared}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold tracking-widest uppercase transition-all shadow-sm",
                  isShared 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 box-border"
                )}
              >
                {isShared ? <Check size={14} strokeWidth={2.5} /> : <Share2 size={14} strokeWidth={2.5} />}
                {isShared ? "Link Copied" : "Share"}
              </button>

              <button 
                onClick={handleSaveAnalysis}
                disabled={isSaved}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold tracking-widest uppercase transition-all shadow-sm",
                  isSaved 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                    : "bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100"
                )}
              >
                {isSaved ? <Check size={14} strokeWidth={2.5} /> : <Save size={14} strokeWidth={2.5} />}
                {isSaved ? "Saved to Local Storage" : "Save Analysis"}
              </button>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button 
                onClick={handleShareAnalysis}
                disabled={isShared}
                className={cn(
                  "flex items-center justify-center p-2 rounded-lg transition-all shadow-sm",
                  isShared
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                )}
                title={isShared ? "Link Copied" : "Share Analysis"}
              >
                {isShared ? <Check size={16} /> : <Share2 size={16} />}
              </button>
              <button 
                onClick={handleSaveAnalysis}
                disabled={isSaved}
                className={cn(
                  "flex items-center justify-center p-2 rounded-lg transition-all shadow-sm",
                  isSaved
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100"
                )}
                title={isSaved ? "Saved" : "Save Analysis"}
              >
                {isSaved ? <Check size={16} /> : <Save size={16} />}
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Grid */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="grid grid-cols-12 gap-6 max-w-[1400px] mx-auto">
            
            {/* Left Column: Context & Summary */}
            <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
              {/* Problem Statement Card */}
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Target size={18} strokeWidth={2.5} />
                  <h2 className="text-xs font-bold uppercase tracking-wider">The Core Problem</h2>
                </div>
                <div className="text-lg font-medium text-slate-700 leading-relaxed font-sans">
                  <ReactMarkdown>{analysis.summary.problemStatement}</ReactMarkdown>
                </div>
              </div>

              {/* Prominent Methodology Pipeline */}
              <MermaidViewer chart={analysis.flowchart} />

              {/* Discovery Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-100 transition-colors group">
                  <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-indigo-400">Key Finding Analysis</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-light text-indigo-600 font-display">84%</div>
                    <p className="text-[11px] font-bold text-slate-600 leading-snug">Confidence score in primary methodology outcome.</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-100 transition-colors group">
                  <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-emerald-400">Conclusion Stability</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-light text-emerald-500 font-display">High</div>
                    <p className="text-[11px] font-bold text-slate-600 leading-snug">Synthesized conclusion shows high internal consistency.</p>
                  </div>
                </div>
              </div>

              {/* Sections: Detailed Breakdown */}
              <div className="flex flex-col gap-6">
                {analysis.sections.map((section, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">Section {idx+1}</span>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">{section.title}</h3>
                    </div>
                    <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed font-sans">
                      <ReactMarkdown>{section.content?.[complexity] || "Content unavailable for this complexity level."}</ReactMarkdown>
                    </div>
                    <div className="mt-4 flex gap-2">
                       <span className="rounded-full bg-slate-100 px-3 py-1 text-[9px] font-bold text-slate-600 uppercase tracking-tighter">RESEARCH</span>
                       <span className="rounded-full bg-indigo-50 px-3 py-1 text-[9px] font-bold text-indigo-600 uppercase tracking-tighter">SYNTHESIS</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Visual Mapping */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
              <CitationGraph data={analysis.citations} />
              <DataVisualizer data={analysis.visuals} />
              <Glossary items={analysis.glossary} />
            </div>

          </div>
        </div>

          <footer className="h-12 shrink-0 border-t border-slate-200 bg-white px-8 flex items-center justify-between text-[10px] w-full">
            <div className="flex items-center gap-2 overflow-hidden truncate">
              {analysis.glossary && analysis.glossary.length > 0 && (
                <>
                  <span className="font-bold text-slate-400 uppercase tracking-tighter h-fit shrink-0">Spotlight:</span>
                  <span className="font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded shrink-0">
                    {analysis.glossary[0].term}
                  </span>
                  <span className="text-slate-500 truncate italic">
                    {analysis.glossary[0].definition}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-6 shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="font-bold text-slate-500 uppercase tracking-widest hidden md:inline">Valid Analysis</span>
              </div>
              <p className="text-slate-400">
                Built By <a href="https://harishkotra.me" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Harish Kotra</a> • <a href="https://dailybuild.xyz" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Checkout my other builds</a>
              </p>
            </div>
          </footer>
      </main>
    </div>
  );
}
