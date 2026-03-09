import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  RefreshCw,
  Heart,
  Rocket,
  Map,
  Lightbulb,
  Wrench,
  Terminal,
  GitBranch,
} from "lucide-react";
import { type Quote } from "../types";
import { quotesAPI } from "../api";

const HomePage = () => {
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomQuote = async () => {
    setLoading(true);
    try {
      const quote = await quotesAPI.getRandom();
      setRandomQuote(quote);
    } catch (error) {
      console.error("Failed to fetch quote:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!randomQuote) return;
    try {
      const updatedQuote = await quotesAPI.favorite(randomQuote.id);
      setRandomQuote(updatedQuote);
    } catch (error) {
      console.error("Failed to favorite quote:", error);
    }
  };

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary-200">
          <Terminal className="w-4 h-4" />
          Open-source DevOps learning platform
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Master <span className="text-primary-600">DevOps</span> from
          <br />
          Zero to Production
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          A structured 30-day roadmap covering containers, CI/CD pipelines,
          cloud infrastructure, and monitoring. Track your progress, gather
          wisdom, and discover the best tools — all in one place.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/progress"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center shadow-lg shadow-primary-600/20"
          >
            <Rocket className="w-5 h-5 mr-2" />
            Begin the Roadmap
          </Link>
          <Link
            to="/voting"
            className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            <GitBranch className="w-5 h-5 mr-2" />
            Explore Tools
          </Link>
        </div>
      </div>

      {/* Daily Insight */}
      <div className="bg-gradient-to-br from-primary-50 to-white border border-primary-200 rounded-2xl p-8 mb-16 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary-600" />
            Daily Insight
          </h2>
          <button
            onClick={fetchRandomQuote}
            disabled={loading}
            className="flex items-center px-4 py-2 text-primary-600 hover:text-primary-700 transition-colors disabled:opacity-50 border border-primary-200 rounded-lg hover:border-primary-400 text-sm font-medium"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {randomQuote && (
          <div className="text-center py-2">
            <blockquote className="text-lg text-gray-700 mb-4 italic leading-relaxed">
              &ldquo;{randomQuote.text}&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <p className="text-gray-500 text-sm">
                — {randomQuote.author}
                <span className="text-primary-600 ml-2 text-xs font-medium bg-primary-50 px-2 py-0.5 rounded-full">
                  {randomQuote.category}
                </span>
              </p>
              <button
                onClick={handleFavorite}
                className="flex items-center text-sm text-gray-400 hover:text-red-500 transition-colors border border-gray-200 rounded-lg px-3 py-1 hover:border-red-300"
              >
                <Heart className="w-4 h-4 mr-1" />
                {randomQuote.favorites}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/progress" className="group">
          <div className="h-full bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-400 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
              <Map className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 transition-colors">
              Learning Roadmap
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Follow a structured 30-day plan to build DevOps skills
              incrementally. Mark your daily milestones and leave notes.
            </p>
          </div>
        </Link>

        <Link to="/quotes" className="group">
          <div className="h-full bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-400 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
              <Lightbulb className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 transition-colors">
              Community Insights
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Browse and favorite curated tips from engineers, SREs, and DevOps
              practitioners across the industry.
            </p>
          </div>
        </Link>

        <Link to="/voting" className="group">
          <div className="h-full bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-400 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
              <Wrench className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 transition-colors">
              Toolbox Rankings
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Upvote the DevOps tools you rely on and see real-time community
              rankings across every category.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
