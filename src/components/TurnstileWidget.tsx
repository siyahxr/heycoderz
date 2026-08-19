"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  action?: string;
  className?: string;
}

export function TurnstileWidget({ onVerify, action = "login", className = "" }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [siteKey, setSiteKey] = useState<string | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    // We fetch the site key from env
    const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    const isPlaceholder = !key || key.includes("your_") || key.includes("placeholder");
    if (key && !isPlaceholder) {
      setSiteKey(key);
    } else {
      // If site key is not configured, auto-verify with fallback token so login/register is not blocked
      const timer = setTimeout(() => {
        onVerify("dev-bypass-token");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [onVerify]);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    const renderWidget = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme: "dark",
            action: action,
            callback: (token: string) => {
              onVerify(token);
            },
            "error-callback": () => {
              console.warn("Turnstile error: fallback to bypass token");
              onVerify("dev-bypass-token");
            },
          });
        } catch (e) {
          console.error("Failed to render Turnstile:", e);
          onVerify("dev-bypass-token");
        }
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      // If script is not yet loaded, wait for the global callback
      window.onloadTurnstileCallback = renderWidget;
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, action, onVerify]);

  if (!siteKey) {
    return null;
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
        strategy="lazyOnload"
        defer
        async
      />
      <div ref={containerRef} className={className} />
    </>
  );
}

// Add TS types for window
declare global {
  interface Window {
    turnstile?: any;
    onloadTurnstileCallback?: () => void;
  }
}
