import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  RefreshCw,
  Star,
  Activity,
  Zap,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { type Wisdom, type Checkpoint, type Tool } from "../models/types";
import { wisdomService, journeyService, toolkitService } from "../services/api";

const LandingView = () => {
  const [featured, setFeatured] = useState<Wisdom | null>(null);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [w, c, t] = await Promise.all([
        wisdomService.getFeatured(),
        journeyService.getAll(),
        toolkitService.getAll(),
      ]);
      setFeatured(w);
      setCheckpoints(c);
      setTools(t);
    } catch (error) {
      console.error("Dashboard load failed:", error);
    }
  };

  const refreshFeatured = async () => {
    setRefreshing(true);
    try {
      const w = await wisdomService.getFeatured();
      setFeatured(w);
    } catch (error) {
      console.error("Failed to refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleStar = async () => {
    if (!featured) return;
    try {
      const updated = await wisdomService.star(featured.id);
      setFeatured(updated);
    } catch (error) {
      console.error("Failed to star:", error);
    }
  };

  const completedSteps = checkpoints.filter((c) => c.done).length;
  const totalSteps = checkpoints.length || 30;
  const topTool = [...tools].sort((a, b) => b.rating - a.rating)[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">
         the last dance  
        </h1>
        <p className="text-gray-500 mt-1">
          another test for the ci-cd pipeline.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Journey Progress</span>
            <Activity className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {completedSteps}<span className="text-lg text-gray-400">/{totalSteps}</span>
          </p>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all"
              style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Wisdom Entries</span>
            <BookOpen className="w-5 h-5 text-violet-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">8</p>
          <p className="text-xs text-gray-400 mt-3">Curated principles & practices</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Top Rated Tool</span>
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {topTool ? topTool.name : "—"}
          </p>
          <p className="text-xs text-gray-400 mt-3">
            {topTool ? `${topTool.rating} community ratings` : "No ratings yet"}
          </p>
        </div>
      </div>

      {/* Featured Wisdom */}
      {featured && (
        <div className="bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-50 border border-indigo-200 rounded-2xl p-8 mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              Featured Wisdom
            </h2>
            <button
              onClick={refreshFeatured}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Shuffle
            </button>
          </div>
          <blockquote className="text-xl text-gray-700 italic leading-relaxed mb-4">
            &ldquo;{featured.message}&rdquo;
          </blockquote>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              — {featured.author}
              <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                {featured.category}
              </span>
            </p>
            <button
              onClick={handleStar}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-amber-500 transition-colors border border-gray-200 rounded-lg px-3 py-1.5 hover:border-amber-300"
            >
              <Star className="w-4 h-4" />
              {featured.stars}
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-5">
        <Link
          to="/journey"
          className="group flex items-center justify-between bg-white border border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-md transition-all"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              Continue Your Journey
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {completedSteps === 0
                ? "Start your 30-step DevOps learning path"
                : `${totalSteps - completedSteps} steps remaining — keep going!`}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
        </Link>

        <Link
          to="/toolkit"
          className="group flex items-center justify-between bg-white border border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-md transition-all"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              Explore the Toolkit
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Rate and discover the best DevOps tools by domain
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
        </Link>
      </div>
    </div>
  );
};

export default LandingView;
