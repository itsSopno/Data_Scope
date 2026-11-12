"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setAIModalOpen } from "@/store/slices/uiSlice";
import { addFilter, clearAllFilters, setGlobalSearch } from "@/store/slices/searchSlice";
import { FilterCondition } from "@/types";
import {
  Sparkles,
  X,
  ArrowRight,
  Bot,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

export function AIQueryAssistantModal() {
  const dispatch = useAppDispatch();
  const { isAIModalOpen } = useAppSelector((state) => state.ui);
  const [prompt, setPrompt] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [previewConditions, setPreviewConditions] = useState<FilterCondition[] | null>(null);

  if (!isAIModalOpen) return null;

  const samplePrompts = [
    "Find active customers from Germany with revenue greater than $10,000",
    "Show High churn risk enterprise accounts",
    "Filter accounts in France or United Kingdom with pending status",
    "Find accounts with revenue > $50,000 and score > 80",
  ];

  const handleTranslate = (queryText: string) => {
    setIsTranslating(true);
    setPrompt(queryText);

    setTimeout(() => {
      const lower = queryText.toLowerCase();
      const generated: FilterCondition[] = [];

      if (lower.includes("active")) {
        generated.push({ id: `ai_${Date.now()}_1`, field: "status", operator: "equals", value: "Active" });
      }
      if (lower.includes("pending")) {
        generated.push({ id: `ai_${Date.now()}_2`, field: "status", operator: "equals", value: "Pending" });
      }
      if (lower.includes("germany")) {
        generated.push({ id: `ai_${Date.now()}_3`, field: "country", operator: "equals", value: "Germany" });
      }
      if (lower.includes("france")) {
        generated.push({ id: `ai_${Date.now()}_4`, field: "country", operator: "equals", value: "France" });
      }
      if (lower.includes("enterprise")) {
        generated.push({ id: `ai_${Date.now()}_5`, field: "tier", operator: "equals", value: "Enterprise" });
      }
      if (lower.includes("high churn") || lower.includes("churn risk")) {
        generated.push({ id: `ai_${Date.now()}_6`, field: "churnRisk", operator: "equals", value: "High" });
      }
      if (lower.includes("10,000") || lower.includes("10000")) {
        generated.push({ id: `ai_${Date.now()}_7`, field: "revenue", operator: "gt", value: 10000 });
      } else if (lower.includes("50,000") || lower.includes("50000")) {
        generated.push({ id: `ai_${Date.now()}_8`, field: "revenue", operator: "gt", value: 50000 });
      }
      if (lower.includes("80")) {
        generated.push({ id: `ai_${Date.now()}_9`, field: "score", operator: "gt", value: 80 });
      }

      setPreviewConditions(generated);
      setIsTranslating(false);
    }, 600);
  };

  const handleApply = () => {
    if (!previewConditions) return;
    dispatch(clearAllFilters());
    previewConditions.forEach((c) => dispatch(addFilter(c)));
    dispatch(setAIModalOpen(false));
    setPreviewConditions(null);
    setPrompt("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">AI Natural Language Search</h3>
              <p className="text-[11px] text-muted-foreground">
                Convert English prompts into verified SQL search filters
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(setAIModalOpen(false))}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Input */}
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Describe your search requirements:</label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Find active customers from Germany with revenue greater than $10,000..."
                rows={3}
                className="w-full text-xs p-3 bg-muted/50 border border-input rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>
          </div>

          {/* Sample Prompts */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">Or click an example prompt:</span>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((sp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTranslate(sp)}
                  className="text-[11px] bg-muted/80 hover:bg-muted text-foreground/80 hover:text-foreground px-2.5 py-1 rounded-md border border-input transition-colors text-left"
                >
                  &quot;{sp}&quot;
                </button>
              ))}
            </div>
          </div>

          {/* Translated Filters Preview */}
          {previewConditions && (
            <div className="p-3.5 bg-primary/5 border border-primary/20 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <CheckCircle className="h-4 w-4 text-primary" /> Generated Validated Filters:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {previewConditions.map((c) => (
                  <span
                    key={c.id}
                    className="text-xs bg-background border border-border px-2 py-0.5 rounded text-foreground font-medium"
                  >
                    <span className="capitalize text-muted-foreground">{String(c.field)}</span>{" "}
                    <span className="text-primary font-bold">{c.operator}</span>{" "}
                    <span className="font-semibold">{String(c.value)}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
          <button
            onClick={() => handleTranslate(prompt)}
            disabled={!prompt.trim() || isTranslating}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            {isTranslating ? "Translating..." : "Generate Filter Config"}
          </button>

          <button
            onClick={handleApply}
            disabled={!previewConditions || previewConditions.length === 0}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            Apply to Table <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

