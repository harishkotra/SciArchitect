import { ComplexityLevel } from "../types";
import { cn } from "../lib/utils";
import { User, GraduationCap, Microscope } from "lucide-react";

interface ComplexitySliderProps {
  level: ComplexityLevel;
  onChange: (level: ComplexityLevel) => void;
}

export default function ComplexitySlider({ level, onChange }: ComplexitySliderProps) {
  const levels: { id: ComplexityLevel; label: string; icon: any }[] = [
    { id: "layman", label: "Layman", icon: User },
    { id: "undergraduate", label: "Undergrad", icon: GraduationCap },
    { id: "expert", label: "Expert", icon: Microscope },
  ];

  return (
    <div className="flex p-0.5 bg-slate-100 rounded-lg space-x-0.5">
      {levels.map((item) => {
        const Icon = item.icon;
        const isActive = level === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              "flex items-center space-x-2 px-4 py-1.5 rounded-md text-[11px] font-bold transition-all duration-200 outline-none",
              isActive 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Icon size={14} />
            <span className="uppercase tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
