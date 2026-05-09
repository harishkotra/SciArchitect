import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { ZoomIn, ZoomOut, Maximize2, Minimize2, RefreshCcw } from "lucide-react";
import { cn } from "../lib/utils";

mermaid.initialize({
  startOnLoad: true,
  theme: "base",
  themeVariables: {
    primaryColor: "#f8fafc",
    primaryTextColor: "#0f172a",
    primaryBorderColor: "#e2e8f0",
    lineColor: "#64748b",
    secondaryColor: "#f1f5f9",
    tertiaryColor: "#ffffff",
  },
});

interface MermaidViewerProps {
  chart: string;
}

export default function MermaidViewer({ chart }: MermaidViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (containerRef.current && chart) {
      containerRef.current.innerHTML = `<div class="mermaid">${chart}</div>`;
      mermaid.contentLoaded();
    }
  }, [chart, zoom, isFullscreen]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setIsFullscreen(false);
  };

  return (
    <div 
      className={cn(
        "w-full transition-all duration-500 ease-in-out",
        isFullscreen 
          ? "fixed inset-0 z-[100] bg-white p-8 overflow-hidden flex flex-col" 
          : "relative overflow-hidden bg-slate-100/50 border border-slate-200 rounded-2xl p-6 shadow-inner"
      )}
    >
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex flex-col">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Methodology Pipeline
          </h3>
          {isFullscreen && (
            <p className="text-xs text-slate-500 font-medium">Full System Architecture View</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg p-1 shadow-sm">
            <button 
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-slate-50 rounded text-slate-500 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <span className="px-2 text-[10px] font-bold text-slate-600 min-w-[45px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button 
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-slate-50 rounded text-slate-500 transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
          </div>
          
          <button 
            onClick={handleReset}
            className="p-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 shadow-sm transition-all"
            title="Reset View"
          >
            <RefreshCcw size={14} />
          </button>

          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 shadow-sm transition-all"
            title={isFullscreen ? "Close Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      <div 
        className={cn(
          "flex-1 overflow-auto cursor-grab active:cursor-grabbing",
          isFullscreen ? "bg-slate-50/50 rounded-2xl border border-slate-100" : ""
        )}
      >
        <div 
          className="flex justify-center items-start py-8 transition-transform duration-200 origin-top"
          style={{ transform: `scale(${zoom})` }}
        >
          <div ref={containerRef} className="min-w-fit" />
        </div>
      </div>

      {isFullscreen && (
        <div className="mt-6 flex justify-center shrink-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm">
            Scroll to pan • Use controls to zoom
          </p>
        </div>
      )}
    </div>
  );
}
