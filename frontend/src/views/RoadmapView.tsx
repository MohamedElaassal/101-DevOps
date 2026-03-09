import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Check,
  Circle,
  Pencil,
  X,
} from "lucide-react";
import { type Checkpoint } from "../models/types";
import { journeyService } from "../services/api";

const phaseStyles: Record<string, { color: string; bg: string; border: string }> = {
  Foundation: { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  Scaling: { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  Production: { color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
};

const RoadmapView = () => {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPhase, setExpandedPhase] = useState<string | null>("Foundation");
  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [memo, setMemo] = useState("");

  useEffect(() => {
    fetchCheckpoints();
  }, []);

  const fetchCheckpoints = async () => {
    try {
      const data = await journeyService.getAll();
      setCheckpoints(data);
    } catch (error) {
      console.error("Failed to fetch checkpoints:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePhase = (phase: string) => {
    setExpandedPhase((prev) => (prev === phase ? null : phase));
  };

  const handleToggleDone = async (cp: Checkpoint) => {
    try {
      const updated = await journeyService.update(cp.step, {
        done: !cp.done,
        memo: cp.memo,
      });
      setCheckpoints((prev) =>
        prev.map((c) => (c.step === cp.step ? updated : c)),
      );
    } catch (error) {
      console.error("Failed to toggle checkpoint:", error);
    }
  };

  const openEditor = (cp: Checkpoint) => {
    setEditingStep(cp.step);
    setMemo(cp.memo || "");
  };

  const saveMemo = async () => {
    if (editingStep === null) return;
    try {
      const updated = await journeyService.update(editingStep, {
        done: true,
        memo: memo.trim() || null,
      });
      setCheckpoints((prev) =>
        prev.map((c) => (c.step === editingStep ? updated : c)),
      );
      setEditingStep(null);
      setMemo("");
    } catch (error) {
      console.error("Failed to save memo:", error);
    }
  };

  const phases = ["Foundation", "Scaling", "Production"];
  const byPhase = phases.reduce(
    (acc, phase) => {
      acc[phase] = checkpoints.filter((c) => c.phase === phase);
      return acc;
    },
    {} as Record<string, Checkpoint[]>,
  );

  const totalDone = checkpoints.filter((c) => c.done).length;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">
        Loading journey...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          DevOps Journey
        </h1>
        <p className="text-gray-500 mt-1 mb-6">
          30 steps across three phases — expand a phase to track your progress.
        </p>

        {/* Segmented Progress */}
        <div className="flex gap-0.5 mb-2">
          {checkpoints.map((cp) => (
            <div
              key={cp.step}
              className={`flex-1 h-2 rounded-sm transition-colors ${
                cp.done ? "bg-indigo-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-400">
          {totalDone} of {checkpoints.length} completed
        </p>
      </div>

      {/* Phase Accordion */}
      <div className="space-y-4">
        {phases.map((phase) => {
          const items = byPhase[phase] || [];
          const phaseDone = items.filter((c) => c.done).length;
          const cfg = phaseStyles[phase];
          const isOpen = expandedPhase === phase;

          return (
            <div
              key={phase}
              className={`border rounded-xl overflow-hidden ${cfg.border}`}
            >
              <button
                onClick={() => togglePhase(phase)}
                className={`w-full flex items-center justify-between px-5 py-4 ${cfg.bg} transition-colors`}
              >
                <div className="flex items-center gap-3">
                  {isOpen ? (
                    <ChevronDown className={`w-5 h-5 ${cfg.color}`} />
                  ) : (
                    <ChevronRight className={`w-5 h-5 ${cfg.color}`} />
                  )}
                  <span className={`font-bold ${cfg.color}`}>{phase}</span>
                  <span className="text-xs text-gray-500">
                    Steps {items[0]?.step}–{items[items.length - 1]?.step}
                  </span>
                </div>
                <span className={`text-sm font-medium ${cfg.color}`}>
                  {phaseDone}/{items.length}
                </span>
              </button>

              {isOpen && (
                <div className="divide-y divide-gray-100 bg-white">
                  {items.map((cp) => (
                    <div
                      key={cp.step}
                      className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <button
                        onClick={() => handleToggleDone(cp)}
                        className="flex-shrink-0"
                      >
                        {cp.done ? (
                          <Check className="w-5 h-5 text-indigo-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            cp.done
                              ? "text-gray-400 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          <span className="text-gray-400 mr-2">#{cp.step}</span>
                          {cp.title}
                        </p>
                        {cp.memo && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate">
                            {cp.memo}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => openEditor(cp)}
                        className="flex-shrink-0 text-gray-300 hover:text-indigo-500 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Memo Editor Modal */}
      {editingStep !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">
                Step #{editingStep} — Notes
              </h3>
              <button
                onClick={() => setEditingStep(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="What did you learn or discover?"
              className="w-full p-3 border border-gray-200 rounded-xl resize-none h-28 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={saveMemo}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Save & Complete
              </button>
              <button
                onClick={() => setEditingStep(null)}
                className="px-4 py-2 text-gray-500 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapView;
