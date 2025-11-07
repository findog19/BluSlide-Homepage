"use client";

import { Concept } from "@/types";

interface ConceptCardProps {
  concept: Concept;
  isSelected?: boolean;
  onSelect?: (conceptId: string) => void;
}

export default function ConceptCard({
  concept,
  isSelected = false,
  onSelect,
}: ConceptCardProps) {
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(concept.id);
    }
  };

  return (
    <div
      className={`
        relative rounded-lg border bg-white p-6
        transition-all duration-200 hover:shadow-lg hover:-translate-y-1
        ${isSelected
          ? 'ring-4 ring-blue-500 border-blue-500 bg-blue-50'
          : 'border-gray-200'
        }
      `}
    >
      {/* Selection button */}
      {onSelect && (
        <button
          onClick={handleSelect}
          className="absolute top-3 right-3 text-2xl transition-transform hover:scale-110 z-10"
          aria-label={isSelected ? "Deselect concept" : "Select concept"}
          title={isSelected ? "Click to deselect" : "Click to select"}
        >
          {isSelected ? '⭐' : '☆'}
        </button>
      )}

      {/* Concept name */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2 pr-8">
        {concept.name}
      </h3>

      {/* Tagline */}
      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
        {concept.tagline}
      </p>

      {/* Quality tags */}
      <div className="flex flex-wrap gap-2">
        {concept.qualities.map((quality, idx) => (
          <span
            key={idx}
            className={`text-xs px-2 py-1 rounded-full ${
              isSelected
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {quality}
          </span>
        ))}
      </div>

      {/* Show blends attribution for hybrid concepts */}
      {concept.blends && concept.blends.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Blends: <span className="font-medium text-gray-700">{concept.blends.join(" + ")}</span>
          </p>
        </div>
      )}

      {/* Selection indicator overlay */}
      {isSelected && (
        <div className="absolute inset-0 border-4 border-blue-500 rounded-lg pointer-events-none" />
      )}
    </div>
  );
}
