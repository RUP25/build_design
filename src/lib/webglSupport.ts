const GL_OPTIONS: WebGLContextAttributes = {
  alpha: false,
  antialias: false,
  depth: true,
  stencil: false,
  failIfMajorPerformanceCaveat: false,
  powerPreference: "default",
};

export type WebGLProbeResult = {
  supported: boolean;
  sandboxed: boolean;
  reason: string;
  renderer: string | null;
};

let cachedUnsupported: WebGLProbeResult | null = null;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/** Heuristic for IDE panels / Electron shells that block GPU access. */
export function isEmbeddedBrowser(): boolean {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent;
  return (
    ua.includes("Electron") ||
    ua.includes("Cursor") ||
    ua.includes("Code/") ||
    window.self !== window.top ||
    window.frameElement !== null
  );
}

function releaseContext(gl: WebGLRenderingContext) {
  const ext = gl.getExtension("WEBGL_lose_context");
  ext?.loseContext();
}

function tryCreateContext(): {
  ok: boolean;
  renderer: string | null;
  reason: string;
} {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 2;

  const gl =
    canvas.getContext("webgl2", GL_OPTIONS) ??
    canvas.getContext("webgl", GL_OPTIONS) ??
    canvas.getContext("experimental-webgl", GL_OPTIONS);

  if (!gl || !("getExtension" in gl)) {
    return {
      ok: false,
      renderer: null,
      reason:
        "Could not create a WebGL context (GL_RENDERER = Disabled, Sandboxed = yes).",
    };
  }

  const webgl = gl as WebGLRenderingContext;
  const debugInfo = webgl.getExtension("WEBGL_debug_renderer_info");
  const renderer = debugInfo
    ? (webgl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string)
    : (webgl.getParameter(webgl.RENDERER) as string);

  releaseContext(webgl);

  const rendererText = String(renderer);
  if (/disabled/i.test(rendererText)) {
    return {
      ok: false,
      renderer: rendererText,
      reason:
        "WebGL renderer is disabled in this window (Sandboxed = yes).",
    };
  }

  return {
    ok: true,
    renderer: rendererText,
    reason: "WebGL is available.",
  };
}

function testWebGLOnce(): WebGLProbeResult {
  if (typeof window === "undefined") {
    return {
      supported: false,
      sandboxed: false,
      reason: "Not running in a browser window.",
      renderer: null,
    };
  }

  if (isEmbeddedBrowser()) {
    return {
      supported: false,
      sandboxed: true,
      reason: "Embedded browser detected — open localhost in standalone Chrome.",
      renderer: null,
    };
  }

  try {
    const first = tryCreateContext();
    if (!first.ok) {
      return {
        supported: false,
        sandboxed: true,
        reason: first.reason,
        renderer: first.renderer,
      };
    }

    return {
      supported: true,
      sandboxed: false,
      reason: first.reason,
      renderer: first.renderer,
    };
  } catch (error) {
    return {
      supported: false,
      sandboxed: isEmbeddedBrowser(),
      reason:
        error instanceof Error ? error.message : "WebGL probe threw an error.",
      renderer: null,
    };
  }
}

export function resetWebGLSupportCache(): void {
  cachedUnsupported = null;
}

/** Verify twice with a pause so probe contexts are fully released before Canvas mounts. */
export async function getWebGLSupport(
  force = false,
): Promise<WebGLProbeResult> {
  if (!force && cachedUnsupported !== null) {
    return cachedUnsupported;
  }

  const first = testWebGLOnce();
  if (!first.supported) {
    cachedUnsupported = first;
    return first;
  }

  await sleep(200);

  const second = tryCreateContext();
  if (!second.ok) {
    const result: WebGLProbeResult = {
      supported: false,
      sandboxed: true,
      reason: `${second.reason} (recheck after release failed)`,
      renderer: second.renderer,
    };
    cachedUnsupported = result;
    return result;
  }

  await sleep(100);

  return {
    supported: true,
    sandboxed: false,
    reason: second.reason,
    renderer: second.renderer,
  };
}
