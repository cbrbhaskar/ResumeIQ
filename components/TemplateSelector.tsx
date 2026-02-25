"use client";

import { useState } from "react";
import { TemplateId, TEMPLATE_LIST, MOCK_RESUME_DATA } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { TemplatePreview } from "./template-preview";

interface TemplateSelectorProps {
  selectedTemplate: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  showPreview?: boolean;
}

export function TemplateSelector({
  selectedTemplate,
  onSelectTemplate,
  showPreview = true,
}: TemplateSelectorProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<TemplateId | null>(
    null
  );

  return (
    <div className="space-y-6">
      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {TEMPLATE_LIST.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
            className={`relative rounded-xl border-2 p-4 text-left transition-all ${
              selectedTemplate === template.id
                ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20"
                : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-violet-300 dark:hover:border-violet-700"
            }`}
          >
            {/* Template thumbnail representation */}
            <div className="mb-3 h-32 rounded bg-gray-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden relative">
              <div
                className="w-full h-full flex flex-col p-2"
                style={{
                  backgroundColor: template.style.colors.light,
                }}
              >
                {/* Header */}
                <div
                  className="h-6 rounded w-3/4 mb-2"
                  style={{
                    backgroundColor: template.style.colors.primary,
                  }}
                />
                {/* Content lines */}
                <div className="space-y-1 flex-1">
                  <div
                    className="h-1.5 w-full rounded"
                    style={{
                      backgroundColor: template.style.colors.secondary,
                      opacity: 0.5,
                    }}
                  />
                  <div
                    className="h-1.5 w-3/4 rounded"
                    style={{
                      backgroundColor: template.style.colors.secondary,
                      opacity: 0.5,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Template name and info */}
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              {template.name}
            </h3>
            <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">
              {template.description}
            </p>

            {/* Selected indicator */}
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 bg-violet-500 text-white rounded-full p-1">
                <Check className="w-3 h-3" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Live Preview */}
      {showPreview && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Live Preview
          </h2>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <TemplatePreview
              templateId={selectedTemplate}
              data={MOCK_RESUME_DATA}
            />
          </div>
        </div>
      )}
    </div>
  );
}
