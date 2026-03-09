import { useState, useEffect } from "react";
import { Star, Trophy, Filter } from "lucide-react";
import { type Tool } from "../models/types";
import { toolkitService } from "../services/api";

const ToolboxView = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDomain, setActiveDomain] = useState<string>("All");

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const data = await toolkitService.getAll();
      setTools(data);
    } catch (error) {
      console.error("Failed to fetch tools:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (id: number) => {
    try {
      const updated = await toolkitService.rate(id);
      setTools((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.error("Failed to rate tool:", error);
    }
  };

  const domains = ["All", ...Array.from(new Set(tools.map((t) => t.domain)))];
  const filtered =
    activeDomain === "All"
      ? [...tools].sort((a, b) => b.rating - a.rating)
      : tools
          .filter((t) => t.domain === activeDomain)
          .sort((a, b) => b.rating - a.rating);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">
        Loading toolkit...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Toolkit Leaderboard
        </h1>
        <p className="text-gray-500 mt-1 mb-6">
          Rate the tools you trust and see the community rankings in real time.
        </p>

        {/* Domain Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400" />
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDomain(d)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeDomain === d
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[3rem_1fr_6rem_5rem] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Rank</span>
          <span>Tool</span>
          <span className="text-center">Domain</span>
          <span className="text-right">Rating</span>
        </div>

        {filtered.map((tool, idx) => (
          <div
            key={tool.id}
            className="grid grid-cols-[3rem_1fr_6rem_5rem] gap-4 px-5 py-3.5 items-center border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center justify-center">
              {idx === 0 ? (
                <Trophy className="w-5 h-5 text-amber-500" />
              ) : (
                <span className="text-sm font-bold text-gray-400">
                  {idx + 1}
                </span>
              )}
            </span>
            <span className="font-medium text-gray-900">{tool.name}</span>
            <span className="text-center">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                {tool.domain}
              </span>
            </span>
            <button
              onClick={() => handleRate(tool.id)}
              className="flex items-center justify-end gap-1 text-sm text-gray-500 hover:text-amber-500 transition-colors group"
            >
              <Star className="w-4 h-4 group-hover:fill-amber-400" />
              <span className="font-medium">{tool.rating}</span>
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center text-gray-400">
            No tools in this domain yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolboxView;
