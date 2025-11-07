"use client";

import { GallerySection } from "@/types";

interface SectionHeaderProps {
  section: GallerySection;
}

const sophisticationLabels: Record<number, string> = {
  1: "🎯 Most Practical",
  2: "🎯 Practical",
  3: "💙 Warm & Relatable",
  4: "⚡ Aspirational",
  5: "🎨 Elegant",
  6: "🎨 Poetic",
  7: "🎨 Abstract",
  8: "🎨 Most Creative",
};

export default function SectionHeader({ section }: SectionHeaderProps) {
  const sophistication = section.sophistication || 3;
  const percentage = (sophistication / 8) * 100;

  return (
    <div className="mb-8" id={section.id}>
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-gray-900">
            {section.title}
          </h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {sophisticationLabels[sophistication] || `Level ${sophistication}`}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3">
          {section.description}
        </p>

        {/* Sophistication spectrum meter */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-medium">Practical</span>
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 font-medium">Abstract</span>
        </div>
      </div>
    </div>
  );
}
