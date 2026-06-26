import { getWebGLSupport, resetWebGLSupportCache } from "@/lib/webglSupport";
import { useCallback, useEffect, useState } from "react";
import type { WebGLProbeResult } from "@/lib/webglSupport";

export type WebGLSupportState = "checking" | "supported" | "unsupported";

export function useWebGLSupported() {
  const [state, setState] = useState<WebGLSupportState>("checking");
  const [details, setDetails] = useState<WebGLProbeResult | null>(null);

  const runProbe = useCallback(async (force = false) => {
    setState("checking");
    if (force) resetWebGLSupportCache();

    const result = await getWebGLSupport(force);
    setDetails(result);
    setState(result.supported ? "supported" : "unsupported");
  }, []);

  useEffect(() => {
    void runProbe(false);
  }, [runProbe]);

  const retry = useCallback(() => {
    void runProbe(true);
  }, [runProbe]);

  return { state, details, retry };
}
