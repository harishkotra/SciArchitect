import { GlossaryItem } from "../types";
import { BookOpen } from "lucide-react";

interface GlossaryProps {
  items: GlossaryItem[];
}

export default function Glossary({ items }: GlossaryProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <BookOpen className="text-indigo-600" size={16} strokeWidth={2.5} />
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Terminology Bank</h3>
      </div>
      <div className="space-y-6">
        {items.map((item, i) => (
          <div key={i} className="group border-b border-slate-50 last:border-0 pb-4 last:pb-0">
            <h4 className="text-[11px] font-bold text-slate-900 mb-1 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
              {item.term}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              {item.definition}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
