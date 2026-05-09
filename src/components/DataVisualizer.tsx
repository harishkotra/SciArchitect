import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartData } from "../types";

interface DataVisualizerProps {
  data: ChartData[];
}

export default function DataVisualizer({ data }: DataVisualizerProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Quantitative Scale Analysis</h3>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-2 rounded shadow-xl border border-slate-800">
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1">{payload[0].payload.label}</p>
                      <p className="text-xs font-light">
                        <span className="font-bold text-indigo-400">{payload[0].value}</span> {payload[0].payload.unit}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={32}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#4f46e5' : '#6366f1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-between text-[8px] font-bold text-slate-300 uppercase tracking-widest">
        <span>Baseline</span>
        <span>Peak Delta</span>
      </div>
    </div>
  );
}
