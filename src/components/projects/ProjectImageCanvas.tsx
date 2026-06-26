"use client";

import Image from "next/image";
import type { Project } from "@/lib/content";

type ProjectImageCanvasProps = {
  projects: Project[];
  progress: number;
};

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function ImagePlane({
  src,
  alt,
  opacity,
  parallaxX,
  parallaxY,
  rotate,
  className,
}: {
  src: string;
  alt: string;
  opacity: number;
  parallaxX: number;
  parallaxY: number;
  rotate: number;
  className: string;
}) {
  if (opacity <= 0.01) return null;

  return (
    <div
      className={`absolute overflow-hidden rounded-sm will-change-transform ${className}`}
      style={{
        opacity,
        transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0) rotateY(${rotate}deg)`,
      }}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 55vw" />
    </div>
  );
}

export function ProjectImageCanvas({
  projects,
  progress,
}: ProjectImageCanvasProps) {
  const maxIndex = projects.length - 1;
  const clamped = Math.max(0, Math.min(maxIndex, progress));
  const currentIndex = Math.min(Math.floor(clamped), Math.max(0, maxIndex - 1));
  const nextIndex = Math.min(currentIndex + 1, maxIndex);
  const localT = easeInOut(clamped - currentIndex);

  const current = projects[currentIndex];
  const next = projects[nextIndex];

  const parallax = localT * 12;

  return (
    <div className="relative h-full w-full" aria-hidden="true">
      {/* Back plane — primary images */}
      <ImagePlane
        src={current.image}
        alt={current.name}
        opacity={1 - localT}
        parallaxX={-parallax * 0.4}
        parallaxY={-parallax * 0.2}
        rotate={-localT * 1.5}
        className="projects-image-plane-back bottom-[8%] left-[2%] z-[1] h-[72%] w-[42%]"
      />
      <ImagePlane
        src={next.image}
        alt={next.name}
        opacity={localT}
        parallaxX={-parallax * 0.4}
        parallaxY={-parallax * 0.2}
        rotate={-localT * 1.5}
        className="projects-image-plane-back bottom-[8%] left-[2%] z-[2] h-[72%] w-[42%]"
      />

      {/* Front plane — secondary images, overlapping top-right */}
      <ImagePlane
        src={current.imageSecondary}
        alt={`${current.name} detail`}
        opacity={1 - localT}
        parallaxX={parallax * 0.6}
        parallaxY={parallax * 0.3}
        rotate={localT * 2}
        className="projects-image-plane-front right-[0%] top-[4%] z-[3] h-[58%] w-[62%]"
      />
      <ImagePlane
        src={next.imageSecondary}
        alt={`${next.name} detail`}
        opacity={localT}
        parallaxX={parallax * 0.6}
        parallaxY={parallax * 0.3}
        rotate={localT * 2}
        className="projects-image-plane-front right-[0%] top-[4%] z-[4] h-[58%] w-[62%]"
      />
    </div>
  );
}
