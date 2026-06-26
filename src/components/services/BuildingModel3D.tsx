"use client";

import { useWebGLSupported } from "@/hooks/useWebGLSupported";
import { isEmbeddedBrowser, resetWebGLSupportCache, type WebGLProbeResult } from "@/lib/webglSupport";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

const BuildingModelCanvas = dynamic(
  () =>
    import("./BuildingModelCanvas").then((mod) => mod.BuildingModelCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-[#080808]">
        <p className="text-xs tracking-[0.22em] text-white/40 uppercase">
          Loading 3D engine…
        </p>
      </div>
    ),
  },
);

type BuildingModel3DProps = {
  activeStep: number;
  onStepChange: (step: number) => void;
  isVisible?: boolean;
  className?: string;
  mobileCameraPullBack?: number;
};

function WebGLUnavailable({
  details,
  onRetry,
}: {
  details: WebGLProbeResult | null;
  onRetry: () => void;
}) {
  const sandboxed = details?.sandboxed ?? isEmbeddedBrowser();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#080808] px-8 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1a0c06] via-[#080808] to-[#0a1520] opacity-90"
      />
      <div className="relative z-[1] max-w-lg">
        <p className="text-xs tracking-[0.22em] text-white/50 uppercase">
          3D viewer blocked — sandboxed browser
        </p>
        <p className="mx-auto mt-3 text-sm leading-relaxed text-white/45">
          {sandboxed ? (
            <>
              This window cannot access your GPU (Chrome reports{" "}
              <span className="font-mono text-white/55">Sandboxed = yes</span>
              ). That happens when you view localhost{" "}
              <strong className="font-normal text-white/70">
                inside Cursor or VS Code
              </strong>
              , even if the address bar says localhost:3000.
            </>
          ) : (
            <>
              WebGL failed to start. Enable hardware acceleration in Chrome/Edge
              settings, restart the browser, then reload.
            </>
          )}
        </p>
        {sandboxed && (
          <ol className="mx-auto mt-4 max-w-md space-y-2 text-left text-xs leading-relaxed text-white/40">
            <li>
              1. Press the Windows key and open{" "}
              <strong className="font-normal text-white/55">Google Chrome</strong>{" "}
              (desktop app)
            </li>
            <li>
              2. Type{" "}
              <span className="font-mono text-white/55">localhost:3000</span> in
              the address bar
            </li>
            <li>3. Do not click localhost links inside Cursor</li>
            <li>
              4. Already in standalone Chrome? Enable hardware acceleration in
              Settings → System, then restart
            </li>
          </ol>
        )}
        {process.env.NODE_ENV === "development" && details && (
          <p className="mt-4 font-mono text-[10px] leading-relaxed text-white/30">
            {details.reason}
            {details.renderer ? ` · ${details.renderer}` : ""}
          </p>
        )}
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-full border border-white/20 px-4 py-2 text-[11px] tracking-[0.16em] text-white/70 uppercase transition hover:border-white/40 hover:text-white"
        >
          Check again
        </button>
      </div>
    </div>
  );
}

export function BuildingModel3D({
  activeStep,
  onStepChange,
  isVisible = true,
  className = "",
  mobileCameraPullBack,
}: BuildingModel3DProps) {
  const [mountKey, setMountKey] = useState(0);
  const [canvasFailed, setCanvasFailed] = useState(false);
  const { state: webgl, details, retry } = useWebGLSupported();

  const recheck = useCallback(() => {
    setCanvasFailed(false);
    retry();
    setMountKey((key) => key + 1);
  }, [retry]);

  const handleCanvasFailed = useCallback(() => {
    resetWebGLSupportCache();
    setCanvasFailed(true);
  }, []);

  useEffect(() => {
    const onWindowError = (event: ErrorEvent) => {
      const message = event.message ?? "";
      if (!/webgl|WebGLRenderer/i.test(message)) return;

      event.preventDefault();
      handleCanvasFailed();
    };

    window.addEventListener("error", onWindowError);
    return () => window.removeEventListener("error", onWindowError);
  }, [handleCanvasFailed]);

  const failureDetails: WebGLProbeResult | null = canvasFailed
    ? {
        supported: false,
        sandboxed: details?.sandboxed ?? isEmbeddedBrowser(),
        reason:
          details?.reason ??
          "WebGL context failed when starting the 3D canvas.",
        renderer: details?.renderer ?? null,
      }
    : details;

  return (
    <div className={`relative h-full min-h-[340px] w-full ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#5c2808]/18 via-transparent to-transparent"
      />
      {webgl === "checking" && !canvasFailed && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#080808]">
          <p className="text-xs tracking-[0.22em] text-white/40 uppercase">
            Preparing 3D viewer…
          </p>
        </div>
      )}
      {(webgl === "unsupported" || canvasFailed) && (
        <WebGLUnavailable details={failureDetails} onRetry={recheck} />
      )}
      {webgl === "supported" && !canvasFailed && (
        <BuildingModelCanvas
          key={mountKey}
          mountKey={mountKey}
          activeStep={activeStep}
          onStepChange={onStepChange}
          isVisible={isVisible}
          onFailed={handleCanvasFailed}
          mobileCameraPullBack={mobileCameraPullBack}
        />
      )}
    </div>
  );
}
