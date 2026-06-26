"use client";

import { Component, useEffect, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback: ReactNode;
  onError?: () => void;
};

/** Catches WebGL / Three.js mount failures and stops re-throwing. */
export class WebGLErrorBoundary extends Component<
  Props,
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("[WebGL]", error.message);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

type DeferredProps = {
  children: ReactNode;
  fallback?: ReactNode;
  /** Wait for Strict Mode double-mount cleanup before creating WebGL. */
  delayMs?: number;
};

/** Delays WebGL canvas creation so dev Strict Mode can release the first context. */
export function DeferredWebGLMount({
  children,
  fallback = null,
  delayMs = 150,
}: DeferredProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (!cancelled) setReady(true);
    }, delayMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      setReady(false);
    };
  }, [delayMs]);

  if (!ready) return fallback;
  return children;
}
