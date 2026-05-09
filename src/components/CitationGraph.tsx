import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { CitationGraphData, CitationNode, CitationLink } from "../types";
import { Network } from "lucide-react";

interface CitationGraphProps {
  data: CitationGraphData;
}

export default function CitationGraph({ data }: CitationGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !data.nodes.length || !containerRef.current || !svgRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 300;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);
    
    svg.selectAll("*").remove(); // Clear previous render

    // We must copy data to avoid mutating props
    const nodes = data.nodes.map(d => ({ ...d }));
    // Handle cases where d3 expects nodes by index/reference
    const links = data.links.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30));

    const link = svg.append("g")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5);

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => d.group === 1 ? 12 : 8)
      .attr("fill", (d) => d.group === 1 ? "#4f46e5" : "#94a3b8")
      .call(drag(simulation) as any);

    node.append("title")
      .text((d) => d.label);

    const labels = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("font-size", "10px")
      .attr("dy", -15)
      .attr("dx", 0)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .text(d => d.label);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => Math.max(12, Math.min(width - 12, d.x)))
        .attr("cy", (d: any) => Math.max(12, Math.min(height - 12, d.y)));
        
      labels
        .attr("x", (d: any) => Math.max(12, Math.min(width - 12, d.x)))
        .attr("y", (d: any) => Math.max(12, Math.min(height - 12, d.y)));
    });

    // Clean up simulation on unmount
    return () => {
      simulation.stop();
    };
  }, [data]);

  // Drag utility for D3
  function drag(simulation: any) {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    
    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  if (!data || !data.nodes || data.nodes.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Network className="text-indigo-600" size={16} strokeWidth={2.5} />
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Citation Universe</h3>
      </div>
      <div ref={containerRef} className="w-full h-[300px] overflow-hidden bg-slate-50/50 rounded-xl border border-slate-100">
        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      </div>
      <div className="mt-4 flex justify-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
          <span>Current Paper</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-400"></div>
          <span>Cited Sources</span>
        </div>
      </div>
    </div>
  );
}
