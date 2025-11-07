"use client";

import { Concept } from "@/types";
import { useRef, useState } from "react";

interface ConceptCardProps {
  concept: Concept;
  onHover?: (conceptId: string, duration: number) => void;
  onExamine?: (conceptId: string) => void;
}

export default function ConceptCard({
  concept,
  onHover,
  onExamine,
}: ConceptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hoverStartRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    hoverStartRef.current = Date.now();
  };

  const handleMouseLeave = () => {
    if (hoverStartRef.current && onHover) {
      const duration = Date.now() - hoverStartRef.current;
      onHover(concept.id, duration);
      hoverStartRef.current = null;
    }
  };

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    if (onExamine && !isExpanded) {
      onExamine(concept.id);
    }
  };

  return (
    <div
      className={`group relative rounded-lg border bg-white transition-all duration-200
                  hover:shadow-lg hover:-translate-y-1 cursor-pointer
                  ${isExpanded ? "border-blue-400 shadow-lg" : "border-gray-200"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {concept.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
          {concept.tagline}
        </p>
        <div className="flex flex-wrap gap-2">
          {concept.qualities.map((quality, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700
                       group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors"
            >
              {quality}
            </span>
          ))}
        </div>

        {/* Show blended from info for hybrid concepts */}
        {(concept as any).blendedFrom && isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Blends:{" "}
              <span className="font-medium text-gray-700">
                {(concept as any).blendedFrom.join(" + ")}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Hover indicator */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
      </div>
    </div>
  );
}
