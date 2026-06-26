"use client";

type AboutModelVisualProps = {
  className?: string;
};

export function AboutModelVisual({ className = "" }: AboutModelVisualProps) {
  return (
    <div className={`about-model-stage about-model-stage--cutout ${className}`}>
      <img
        src="/images/villa-clean.png"
        alt="Modern luxury villa with glass facades, cantilevered terraces, and vertical greenery"
        width={2400}
        height={1792}
        className="about-model-cutout-img"
        loading="eager"
        decoding="sync"
        draggable={false}
      />
    </div>
  );
}
