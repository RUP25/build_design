"use client";

import { useIntersectionVisible } from "@/hooks/useIntersectionVisible";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const BuildingModel3D = dynamic(
  () =>
    import("./BuildingModel3D").then((mod) => mod.BuildingModel3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#080808]">
        <span className="text-xs tracking-[0.25em] text-white/50 uppercase">
          Loading 3D model…
        </span>
      </div>
    ),
  },
);

type ProcessModelViewerProps = {
  activeStep: number;
  onStepChange: (step: number) => void;
  mobileCameraPullBack?: number;
};

export function ProcessModelViewer({
  activeStep,
  onStepChange,
  mobileCameraPullBack,
}: ProcessModelViewerProps) {
  const { ref, visible } = useIntersectionVisible({
    rootMargin: "200px",
    threshold: 0.01,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!visible || mounted) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (!cancelled) setMounted(true);
    }, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [visible, mounted]);

  return (
    <div
      ref={ref}
      className="services-process-model relative h-full min-h-[340px] w-full overflow-hidden bg-[#080808]"
    >
      <div className="absolute inset-0">
        {mounted ? (
          <BuildingModel3D
            activeStep={activeStep}
            onStepChange={onStepChange}
            isVisible={visible}
            mobileCameraPullBack={mobileCameraPullBack}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#080808]">
            <span className="text-xs tracking-[0.25em] text-white/40 uppercase">
              Scroll to load 3D model
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
