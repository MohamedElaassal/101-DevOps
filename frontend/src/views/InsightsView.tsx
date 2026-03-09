import { useState, useEffect } from "react";
import { Heart, Tag } from "lucide-react";
import { type Tip } from "../models/types";
import { insightsService } from "../services/api";

const InsightsView = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string>("All");

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const data = await insightsService.getAll();
      setTips(data);
    } catch (error) {
      console.error("Failed to fetch tips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: number) => {
    try {
      const updated = await insightsService.like(id);
      setTips((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.error("Failed to like tip:", error);
    }
  };

  const tags = [
    "All",
    ...Array.from(new Set(tips.map((t) => t.tag))),
  ];
  const filtered =
    activeTag === "All"
      ? tips
      : tips.filter((t) => t.tag === activeTag);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading insights...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Community Insights
        </h1>
        <p className="text-gray-500 mb-6">
          Curated tips and principles from engineers, SREs, and the broader DevOps ecosystem.
        </p>

        {/* Tag Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border-2 ${
                activeTag === tag
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-primary-300 hover:bg-primary-50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Tips Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tip) => (
          <div
            key={tip.id}
            className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-primary-300 transition-all"
          >
            <blockquote className="text-gray-700 mb-4 text-lg leading-relaxed">
              "{tip.content}"
            </blockquote>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">— {tip.source}</p>
                <div className="flex items-center mt-1">
                  <Tag className="w-3 h-3 text-primary-600 mr-1" />
                  <span className="text-sm text-primary-600">
                    {tip.tag}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleLike(tip.id)}
                className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors group border border-gray-200 rounded-lg px-3 py-2 hover:border-red-300"
              >
                <Heart className="w-5 h-5 group-hover:fill-current" />
                <span className="text-sm">{tip.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No insights found for this tag.</p>
        </div>
      )}
    </div>
  );
};

export default InsightsView;
