"use client";

import { useEffect } from "react";

export function ApiDocLightMode() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevColorScheme = html.style.colorScheme;
    const prevBgVar = html.style.getPropertyValue("--background");
    const prevFgVar = html.style.getPropertyValue("--foreground");
    const prevBodyBg = body.style.background;
    const prevBodyColor = body.style.color;

    html.style.colorScheme = "light";
    html.style.setProperty("--background", "#ffffff");
    html.style.setProperty("--foreground", "#171717");
    body.style.background = "#ffffff";
    body.style.color = "#171717";

    return () => {
      html.style.colorScheme = prevColorScheme;
      if (prevBgVar) html.style.setProperty("--background", prevBgVar);
      else html.style.removeProperty("--background");
      if (prevFgVar) html.style.setProperty("--foreground", prevFgVar);
      else html.style.removeProperty("--foreground");
      body.style.background = prevBodyBg;
      body.style.color = prevBodyColor;
    };
  }, []);

  return null;
}
