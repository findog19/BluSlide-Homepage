"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AttentionSignals, ConceptExamination } from "@/types";

export function useAttentionTracking() {
  const [attentionData, setAttentionData] = useState<AttentionSignals>({
    sectionDwellTimes: {},
    conceptExaminations: {},
    browsingPath: [],
    timestamp: new Date(),
  });

  const sectionTimersRef = useRef<Record<string, number>>({});
  const lastSectionRef = useRef<string | null>(null);

  // Track section visibility using Intersection Observer
  const trackSectionInView = useCallback((sectionId: string, isInView: boolean) => {
    if (isInView) {
      // Section entered viewport
      sectionTimersRef.current[sectionId] = Date.now();

      // Add to browsing path if it's a new section
      setAttentionData((prev) => {
        if (prev.browsingPath[prev.browsingPath.length - 1] !== sectionId) {
          return {
            ...prev,
            browsingPath: [...prev.browsingPath, sectionId],
          };
        }
        return prev;
      });

      lastSectionRef.current = sectionId;
    } else {
      // Section left viewport
      if (sectionTimersRef.current[sectionId]) {
        const dwellTime = Date.now() - sectionTimersRef.current[sectionId];

        setAttentionData((prev) => ({
          ...prev,
          sectionDwellTimes: {
            ...prev.sectionDwellTimes,
            [sectionId]: (prev.sectionDwellTimes[sectionId] || 0) + dwellTime,
          },
        }));

        delete sectionTimersRef.current[sectionId];
      }
    }
  }, []);

  // Track concept hover
  const trackConceptHover = useCallback((conceptId: string, duration: number) => {
    // Only track if hover was meaningful (> 300ms)
    if (duration < 300) return;

    setAttentionData((prev) => {
      const existing = prev.conceptExaminations[conceptId] || {
        hoverCount: 0,
        totalDuration: 0,
        revisits: 0,
      };

      const isRevisit = existing.hoverCount > 0;

      return {
        ...prev,
        conceptExaminations: {
          ...prev.conceptExaminations,
          [conceptId]: {
            hoverCount: existing.hoverCount + 1,
            totalDuration: existing.totalDuration + duration,
            revisits: isRevisit ? existing.revisits + 1 : 0,
            lastHoverTime: new Date(),
          },
        },
      };
    });
  }, []);

  // Track concept examination (click)
  const trackConceptExamine = useCallback((conceptId: string) => {
    setAttentionData((prev) => {
      const existing = prev.conceptExaminations[conceptId] || {
        hoverCount: 0,
        totalDuration: 0,
        revisits: 0,
      };

      return {
        ...prev,
        conceptExaminations: {
          ...prev.conceptExaminations,
          [conceptId]: {
            ...existing,
            // Boost the duration to indicate explicit interest
            totalDuration: existing.totalDuration + 2000,
            hoverCount: existing.hoverCount + 1,
          },
        },
      };
    });
  }, []);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      // Save final dwell times for any active sections
      Object.entries(sectionTimersRef.current).forEach(([sectionId, startTime]) => {
        const dwellTime = Date.now() - startTime;
        setAttentionData((prev) => ({
          ...prev,
          sectionDwellTimes: {
            ...prev.sectionDwellTimes,
            [sectionId]: (prev.sectionDwellTimes[sectionId] || 0) + dwellTime,
          },
        }));
      });
    };
  }, []);

  return {
    attentionData,
    trackSectionInView,
    trackConceptHover,
    trackConceptExamine,
  };
}
