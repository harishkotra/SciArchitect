import { useState, useRef } from "react";
import { Upload, Link, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

interface SourceInputProps {
  onFileSelect: (file: File) => void;
  onUrlSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function SourceInput({ onFileSelect, onUrlSubmit, isLoading }: SourceInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [url, setUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onUrlSubmit(url.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all duration-300",
          isDragging 
            ? "border-indigo-500 bg-indigo-50/50" 
            : "border-slate-200 bg-white",
          isLoading && "opacity-50 pointer-events-none"
        )}
      >
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center cursor-pointer group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />
          
          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Upload className="text-indigo-600" size={28} />
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">
            Upload Research PDF
          </h3>
          <p className="text-slate-500 text-center text-sm max-w-sm mb-2">
            Drag and drop or click to browse.
          </p>
        </div>

        <div className="flex items-center w-full max-w-md my-8">
          <div className="flex-1 h-px bg-slate-100"></div>
          <span className="px-4 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">OR</span>
          <div className="flex-1 h-px bg-slate-100"></div>
        </div>

        <form onSubmit={handleUrlSubmit} className="w-full max-w-md">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <Link size={18} />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste ArXiv URL (e.g. arxiv.org/abs/2405.12345)"
              className="w-full pl-12 pr-28 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
            />
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="absolute right-2 inset-y-2 px-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
            >
              Fetch Paper
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="absolute inset-0 bg-white/60 rounded-2xl flex flex-col items-center justify-center z-10 backdrop-blur-[2px]">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4 shadow-sm shadow-indigo-100"></div>
            <div className="text-center">
              <p className="text-[11px] font-bold text-indigo-600 tracking-widest animate-pulse uppercase mb-1">
                Architecting Dashboard
              </p>
              <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tight">
                Mapping Methodology • Extracting Data
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex items-center space-x-2">
          <Sparkles size={14} className="text-indigo-400" />
          <span>Full PDF Context</span>
        </div>
        <div className="flex items-center space-x-2">
          <Sparkles size={14} className="text-indigo-400" />
          <span>ArXiv Integration</span>
        </div>
      </div>
    </div>
  );
}
