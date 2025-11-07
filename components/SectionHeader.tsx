"use client";

import { GallerySection } from "@/types";

interface SectionHeaderProps {
  section: GallerySection;
}

export default function SectionHeader({ section }: SectionHeaderProps) {
  return (
    <div className="mb-8" id={section.id}>
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {section.title}
        </h2>
        <p className="text-sm text-gray-600">{section.description}</p>
      </div>
    </div>
  );
}
