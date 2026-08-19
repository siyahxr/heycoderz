"use client";

import React, { useEffect, useRef } from "react";
import Script from "next/script";

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  action?: string;
  className?: string;
}

export function TurnstileWidget({
  onVerify,
  onExpire,
  action = "login",
  className = "",
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  onVerifyRef.current = onVerify;
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAEV-dVAkdRK0wvAZ";

  useEffect(() => {
    let isMounted = true;
    let checkInterval: any = null;

    const renderWidget = () => {
      if (!isMounted || !containerRef.current || widgetIdRef.current) return;

      if (window.turnstile && containerRef.current) {
        try {
          // Clear any leftover child nodes
          containerRef.current.innerHTML = "";

          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme: "dark",
            action: action,
            callback: (token: string) => {
              if (isMounted) {
                onVerifyRef.current(token);
              }
            },
            "expired-callback": () => {
              if (isMounted) {
                if (onExpireRef.current) {
                  onExpireRef.current();
                } else {
                  onVerifyRef.current("");
                }
              }
            },
            "error-callback": () => {
              console.warn("[TURNSTILE] Challenge error, fallback enabled");
              if (isMounted) {
                onVerifyRef.current("dev-bypass-token");
              }
            },
          });
        } catch (err) {
          console.error("[TURNSTILE] Failed to render:", err);
          if (isMounted) {
            onVerifyRef.current("dev-bypass-token");
          }
        }
      }
    };

    // If turnstile is already loaded, render immediately
    if (window.turnstile) {
      renderWidget();
    } else {
      // Check every 100ms until loaded (timeout after 5s)
      let elapsed = 0;
      checkInterval = setInterval(() => {
        elapsed += 100;
        if (window.turnstile) {
          clearInterval(checkInterval);
          renderWidget();
        } else if (elapsed > 5000) {
          clearInterval(checkInterval);
          console.warn("[TURNSTILE] Script load timeout, fallback to bypass");
          if (isMounted) {
            onVerifyRef.current("dev-bypass-token");
          }
        }
      }, 100);
    }

    return () => {
      isMounted = false;
      if (checkInterval) clearInterval(checkInterval);
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, action]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
      />
      <div
        ref={containerRef}
        className={className}
        style={{ minHeight: "65px", display: "flex", justifyContent: "center" }}
      />
    </>
  );
}

declare global {
  interface Window {
    turnstile?: any;
  }
}
