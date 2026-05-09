import { useState, useEffect } from "react";
import { ResearchPaperAnalysis } from "./types";
import { analyzePaper } from "./services/gemini";
import SourceInput from "./components/SourceInput";
import ReaderLayout from "./components/ReaderLayout";
import { Telescope, Sparkles, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import LZString from "lz-string";

export default function App() {
  const [analysis, setAnalysis] = useState<ResearchPaperAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a shared analysis in the URL hash
    const hash = window.location.hash;
    if (hash && hash.startsWith('#share=')) {
      try {
        const compressed = hash.substring(7); // Remove '#share='
        const jsonStr = LZString.decompressFromEncodedURIComponent(compressed);
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr) as ResearchPaperAnalysis;
          setAnalysis(parsed);
          // Optional: clear the hash so it doesn't stay in the URL
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch (err) {
        console.error("Failed to load shared analysis:", err);
      }
    }
  }, []);

  const handleFileSelect = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const base64 = await base64Promise;

      const result = await analyzePaper(base64);
      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during file analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleUrlSubmit = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/fetch-arxiv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch ArXiv paper.");

      const result = await analyzePaper(data.base64);
      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while fetching the ArXiv paper.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen font-sans bg-slate-50 text-slate-900">
      <AnimatePresence mode="wait">
        {!analysis ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center min-h-screen px-6 py-20"
          >
            <div className="w-full max-w-4xl">
              <div className="text-center mb-16">
                <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                  <Sparkles size={14} />
                  <span>Next-Gen Academic Intelligence</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight font-display">
                  Democratizing <span className="text-indigo-600">Complex Science</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                  Upload any research manuscript or provide an ArXiv link. Our AI Architect builds an interactive, multi-level dashboard that translates high-level science for everyone.
                </p>
              </div>

              <SourceInput 
                onFileSelect={handleFileSelect} 
                onUrlSubmit={handleUrlSubmit}
                isLoading={loading} 
              />

              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center space-x-3 text-red-600 text-sm max-w-md mx-auto"
                >
                  <BrainCircuit size={18} />
                  <p>{error}</p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                {[
                  {
                    icon: Telescope,
                    title: "Visual Methods",
                    desc: "Methodology sections are instantly converted to clear flowchart diagrams."
                  },
                  {
                    icon: BrainCircuit,
                    title: "Level Adapters",
                    desc: "Toggle between layman, undergraduate, and expert complexity settings."
                  },
                  {
                    icon: Sparkles,
                    title: "Data Extraction",
                    desc: "Quantitative findings are parsed into interactive data visualizations."
                  }
                ].map((feature, i) => (
                  <div key={i} className="text-center space-y-3">
                    <div className="w-12 h-12 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 mb-2">
                      <feature.icon size={22} />
                    </div>
                    <h3 className="font-bold text-slate-800">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ReaderLayout analysis={analysis} onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

